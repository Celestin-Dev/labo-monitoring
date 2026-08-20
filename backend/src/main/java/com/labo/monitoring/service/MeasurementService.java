package com.labo.monitoring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.labo.monitoring.dto.mqtt.MqttMeasurementPayload;
import com.labo.monitoring.model.Measurment;
import com.labo.monitoring.repository.MeasurmentRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MeasurementService {

  @Autowired
  private MeasurmentRepository measurmentRepository;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private AlertEvaluationService alertEvaluationService;

  /**
   * Point d'entrée principal : appelé par le MqttSubscriberService à chaque
   * mesure reçue d'un ESP32. Persiste la mesure, la diffuse en temps réel,
   * puis déclenche l'évaluation des seuils / alertes.
   */
  public Measurment ingest(String zoneId, String deviceId, MqttMeasurementPayload payload) {
    Measurment measurment = new Measurment();
    measurment.setZoneId(zoneId);
    measurment.setDeviceId(deviceId);
    measurment.setTemperature(payload.getTemperature());
    measurment.setHumidity(payload.getHumidity());
    measurment.setCoRaw(payload.getCoRaw());
    measurment.setLuminosity(payload.getLuminosity());
    measurment.setMotionDetected(payload.isMotionDetected());
    measurment.setFireDetected(payload.isFireDetected());
    measurment.setTimestamp(payload.getTimestamp() != null ? payload.getTimestamp() : System.currentTimeMillis());

    Measurment saved = measurmentRepository.save(measurment);
    log.info("Mesure enregistrée - zone={}, device={}, temp={}, hum={}, co={}, lux={}",
        zoneId, deviceId, saved.getTemperature(), saved.getHumidity(), saved.getCoRaw(), saved.getLuminosity());

    notificationService.broadcastMeasurement(saved);
    alertEvaluationService.evaluate(saved);

    return saved;
  }

  public List<Measurment> findByZone(String zoneId, int limit) {
    return measurmentRepository.findByZoneIdOrderByTimestampDesc(zoneId, PageRequest.of(0, limit));
  }

  public List<Measurment> findByDevice(String deviceId, int limit) {
    return measurmentRepository.findByDeviceIdOrderByTimestampDesc(deviceId, PageRequest.of(0, limit));
  }

  public Measurment latestByZone(String zoneId) {
    return measurmentRepository.findFirstByZoneIdOrderByTimestampDesc(zoneId);
  }

  public Measurment latestByDevice(String deviceId) {
    return measurmentRepository.findFirstByDeviceIdOrderByTimestampDesc(deviceId);
  }

  /** Série temporelle pour les graphiques (Monitoring / Historique). */
  public List<Measurment> series(String zoneId, long fromEpochMillis, long toEpochMillis) {
    if (zoneId == null || zoneId.isBlank()) {
      return measurmentRepository.findByTimestampBetweenOrderByTimestampAsc(fromEpochMillis, toEpochMillis);
    }
    return measurmentRepository.findByZoneIdAndTimestampBetweenOrderByTimestampAsc(
        zoneId, fromEpochMillis, toEpochMillis);
  }
}
