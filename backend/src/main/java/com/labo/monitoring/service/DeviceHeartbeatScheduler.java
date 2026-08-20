package com.labo.monitoring.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.labo.monitoring.config.DeviceProperties;
import com.labo.monitoring.enums.AlertType;
import com.labo.monitoring.enums.DeviceStatus;
import com.labo.monitoring.enums.SeverityType;
import com.labo.monitoring.model.Alert;
import com.labo.monitoring.model.Device;
import com.labo.monitoring.repository.AlertRepository;

import lombok.extern.slf4j.Slf4j;

/**
 * Vérifie périodiquement que chaque appareil a bien émis un heartbeat
 * récent. Passé le délai configuré (device.heartbeat-timeout-seconds),
 * l'appareil est marqué OFFLINE et une alerte est levée.
 */
@Slf4j
@Component
public class DeviceHeartbeatScheduler {

  @Autowired
  private DeviceService deviceService;

  @Autowired
  private AlertRepository alertRepository;

  @Autowired
  private NotificationService notificationService;

  @Autowired
  private DeviceProperties deviceProperties;

  @Scheduled(fixedDelay = 30_000)
  public void checkStaleDevices() {
    long threshold = System.currentTimeMillis() - (deviceProperties.getHeartbeatTimeoutSeconds() * 1000L);
    List<Device> staleDevices = deviceService.findStaleDevices(threshold);

    for (Device device : staleDevices) {
      if (device.getStatus() == DeviceStatus.OFFLINE) {
        continue; // déjà marqué hors ligne, pas de doublon d'alerte
      }
      deviceService.updateStatus(device.getId(), DeviceStatus.OFFLINE);

      Alert alert = new Alert();
      alert.setDeviceId(device.getId());
      alert.setZoneId(device.getZoneId());
      alert.setType(AlertType.DEVICE_OFFLINE);
      alert.setSeverity(SeverityType.OFFLINE);
      alert.setMessage("Appareil \"" + device.getName() + "\" hors ligne (pas de heartbeat)");
      alert.setValue("—");
      alert.setTimestamp(Instant.now().toString());
      alert.setAcknowledged(false);
      alert.setResolved(false);

      Alert saved = alertRepository.save(alert);
      notificationService.broadcastAlert(saved);
      log.warn("Appareil {} marqué hors ligne (zone {})", device.getName(), device.getZoneId());
    }
  }
}
