package com.labo.monitoring.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.SeverityType;
import com.labo.monitoring.enums.ZoneStatus;
import com.labo.monitoring.model.Alert;
import com.labo.monitoring.model.Measurment;
import com.labo.monitoring.model.Product;
import com.labo.monitoring.model.Threshold;
import com.labo.monitoring.repository.AlertRepository;
import com.labo.monitoring.repository.ProductRepository;
import com.labo.monitoring.repository.ThresholdRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Compare chaque nouvelle mesure aux règles de seuils de sa zone (et aux
 * plages de conservation des produits qui y sont stockés), crée les
 * alertes nécessaires, et répercute la sévérité la plus haute sur le
 * statut de la zone.
 *
 * Règle de sévérité :
 *  - au-delà de 20% de dépassement du seuil max/min -> CRITICAL
 *  - dépassement du seuil max/min (jusqu'à 20%)      -> WARNING
 *  - sinon                                            -> NORMAL (aucune alerte créée)
 */
@Slf4j
@Service
public class AlertEvaluationService {

  private static final double CRITICAL_MARGIN_RATIO = 0.20;

  @Autowired
  private ThresholdRepository thresholdRepository;

  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private AlertRepository alertRepository;

  @Autowired
  private ZoneService zoneService;

  @Autowired
  private NotificationService notificationService;

  public void evaluate(Measurment measurment) {
    Optional<Threshold> thresholdOpt = thresholdRepository.findByZoneId(measurment.getZoneId());

    SeverityType worst = SeverityType.NORMAL;

    if (thresholdOpt.isPresent() && thresholdOpt.get().isEnabled()) {
      Threshold threshold = thresholdOpt.get();

      worst = max(worst, evaluateRange(measurment, threshold, AlertType.TEMPERATURE,
          measurment.getTemperature(), threshold.getMinTemperature(), threshold.getMaxTemperature(), "°C"));

      worst = max(worst, evaluateRange(measurment, threshold, AlertType.HUMIDITY,
          measurment.getHumidity(), threshold.getMinHumidity(), threshold.getMaxHumidity(), "%"));

      worst = max(worst, evaluateMaxOnly(measurment, threshold, AlertType.CO,
          measurment.getCoRaw(), threshold.getCoMax(), "ppm"));

      worst = max(worst, evaluateMaxOnly(measurment, threshold, AlertType.LUMINOSITY,
          measurment.getLuminosity(), threshold.getLuminosityMax(), "lx"));
    }

    if (measurment.isFireDetected()) {
      createAlert(measurment, null, AlertType.FIRE, SeverityType.CRITICAL,
          "Détection de feu", "true", null);
      worst = max(worst, SeverityType.CRITICAL);
    }

    if (measurment.isMotionDetected()) {
      createAlert(measurment, null, AlertType.MOTION, SeverityType.WARNING,
          "Mouvement détecté", "true", null);
      worst = max(worst, SeverityType.WARNING);
    }

    worst = max(worst, evaluateProducts(measurment));

    zoneService.updateStatus(measurment.getZoneId(), toZoneStatus(worst));
  }

  private SeverityType evaluateRange(Measurment m, Threshold threshold, AlertType type,
                                      double value, double min, double max, String unit) {
    if (value > max) {
      return alertForOverMax(m, threshold, type, value, max, unit);
    }
    if (value < min) {
      return alertForUnderMin(m, threshold, type, value, min, unit);
    }
    return SeverityType.NORMAL;
  }

  private SeverityType evaluateMaxOnly(Measurment m, Threshold threshold, AlertType type,
                                        double value, double max, String unit) {
    if (max <= 0) return SeverityType.NORMAL; // seuil non configuré
    if (value > max) {
      return alertForOverMax(m, threshold, type, value, max, unit);
    }
    return SeverityType.NORMAL;
  }

  private SeverityType alertForOverMax(Measurment m, Threshold threshold, AlertType type,
                                        double value, double max, String unit) {
    double overshoot = (value - max) / max;
    SeverityType severity = overshoot > CRITICAL_MARGIN_RATIO ? SeverityType.CRITICAL : SeverityType.WARNING;
    String message = String.format("%s au-dessus du seuil (%.1f%s > %.1f%s)",
        labelFor(type), value, unit, max, unit);
    createAlert(m, threshold, type, severity, message, value + unit, threshold);
    return severity;
  }

  private SeverityType alertForUnderMin(Measurment m, Threshold threshold, AlertType type,
                                         double value, double min, String unit) {
    double undershoot = min == 0 ? 1 : (min - value) / Math.abs(min);
    SeverityType severity = undershoot > CRITICAL_MARGIN_RATIO ? SeverityType.CRITICAL : SeverityType.WARNING;
    String message = String.format("%s en-dessous du seuil (%.1f%s < %.1f%s)",
        labelFor(type), value, unit, min, unit);
    createAlert(m, threshold, type, severity, message, value + unit, threshold);
    return severity;
  }

  /** Vérifie les produits chimiques stockés dans la zone contre la mesure courante. */
  private SeverityType evaluateProducts(Measurment m) {
    List<Product> products = productRepository.findByZoneId(m.getZoneId());
    SeverityType worst = SeverityType.NORMAL;

    for (Product product : products) {
      boolean tempOut = m.getTemperature() > product.getMaxTemperature()
          || m.getTemperature() < product.getMinTemperature();
      boolean humOut = product.getMaxHumidity() > 0 && m.getHumidity() > product.getMaxHumidity();

      if (tempOut || humOut) {
        SeverityType severity = product.getDangerLevel() >= 2 ? SeverityType.CRITICAL : SeverityType.WARNING;
        String message = String.format(
            "Conditions hors plage pour \"%s\" (réf. %s) : temp=%d°C, hum=%d%%",
            product.getName(), product.getReference(), m.getTemperature(), m.getHumidity());
        createAlert(m, null, AlertType.PRODUCT_THRESHOLD, severity, message,
            m.getTemperature() + "°C / " + m.getHumidity() + "%", null);
        worst = max(worst, severity);
      }
    }
    return worst;
  }

  private void createAlert(Measurment m, Threshold threshold, AlertType type, SeverityType severity,
                            String message, String value, Threshold thresholdSnapshot) {
    Alert alert = new Alert();
    alert.setDeviceId(m.getDeviceId());
    alert.setZoneId(m.getZoneId());
    alert.setType(type);
    alert.setSeverity(severity);
    alert.setMessage(message);
    alert.setValue(value);
    alert.setTimestamp(Instant.ofEpochMilli(m.getTimestamp()).toString());
    alert.setThreshold(thresholdSnapshot);
    alert.setAcknowledged(false);
    alert.setResolved(false);

    Alert saved = alertRepository.save(alert);
    notificationService.broadcastAlert(saved);
    log.info("Alerte créée [{}][{}] zone={} : {}", severity, type, m.getZoneId(), message);
  }

  private ZoneStatus toZoneStatus(SeverityType severity) {
    return switch (severity) {
      case CRITICAL -> ZoneStatus.CRITICAL;
      case WARNING -> ZoneStatus.WARNING;
      case OFFLINE -> ZoneStatus.OFFLINE;
      default -> ZoneStatus.NORMAL;
    };
  }

  private SeverityType max(SeverityType a, SeverityType b) {
    return rank(b) > rank(a) ? b : a;
  }

  private int rank(SeverityType s) {
    return switch (s) {
      case NORMAL -> 0;
      case WARNING -> 1;
      case OFFLINE -> 2;
      case CRITICAL -> 3;
    };
  }

  private String labelFor(AlertType type) {
    return switch (type) {
      case TEMPERATURE -> "Température";
      case HUMIDITY -> "Humidité";
      case CO -> "CO";
      case LUMINOSITY -> "Luminosité";
      case MOTION -> "Mouvement";
      case FIRE -> "Feu";
      case PRODUCT_THRESHOLD -> "Produit";
      case DEVICE_OFFLINE -> "Appareil hors ligne";
    };
  }
}
