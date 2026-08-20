package com.labo.monitoring.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.SeverityType;
import com.labo.monitoring.exception.ResourceNotFoundException;
import com.labo.monitoring.model.Alert;
import com.labo.monitoring.repository.AlertRepository;

@Service
public class AlertService {

  @Autowired
  private AlertRepository alertRepository;

  @Autowired
  private NotificationService notificationService;

  public List<Alert> findAll() {
    return alertRepository.findAll();
  }

  public Alert findById(String id) {
    return alertRepository.findById(id)
        .orElseThrow(() -> ResourceNotFoundException.of("Alerte", id));
  }

  /** Utilisé par la page Alertes (filtres Type / Severity / Zone / Date). */
  public List<Alert> search(AlertType type, SeverityType severity, String zoneId,
                             Boolean acknowledged, Boolean resolved, String fromIso, String toIso) {
    return alertRepository.search(type, severity, zoneId, acknowledged, resolved, fromIso, toIso);
  }

  public List<Alert> recent(int limit) {
    return alertRepository.findTop10ByOrderByTimestampDesc();
  }

  public List<Alert> unresolved() {
    return alertRepository.findAllUnresolvedOrderByTimestampDesc();
  }

  public Alert acknowledge(String id) {
    Alert alert = findById(id);
    alert.setAcknowledged(true);
    alert.setAcknowledgedAt(Instant.now().toString());
    Alert saved = alertRepository.save(alert);
    notificationService.broadcastAlert(saved);
    return saved;
  }

  public Alert resolve(String id) {
    Alert alert = findById(id);
    alert.setResolved(true);
    alert.setResolvedAt(Instant.now().toString());
    if (!alert.isAcknowledged()) {
      alert.setAcknowledged(true);
      alert.setAcknowledgedAt(Instant.now().toString());
    }
    Alert saved = alertRepository.save(alert);
    notificationService.broadcastAlert(saved);
    return saved;
  }

  public Alert save(Alert alert) {
    Alert saved = alertRepository.save(alert);
    notificationService.broadcastAlert(saved);
    return saved;
  }
}
