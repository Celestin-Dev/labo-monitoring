package com.labo.monitoring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.labo.monitoring.model.Alert;
import com.labo.monitoring.model.Device;
import com.labo.monitoring.model.Measurment;
import com.labo.monitoring.model.Zone;

@Service
public class NotificationService {

  @Autowired
  private SimpMessagingTemplate messagingTemplate;

  public void broadcastMeasurement(Measurment measurment) {
    messagingTemplate.convertAndSend("/topic/measurements", measurment);
  }

  public void broadcastAlert(Alert alert) {
    messagingTemplate.convertAndSend("/topic/alerts", alert);
  }

  public void broadcastZoneUpdate(Zone zone) {
    messagingTemplate.convertAndSend("/topic/zones", zone);
  }

  public void broadcastDeviceUpdate(Device device) {
    messagingTemplate.convertAndSend("/topic/devices", device);
  }
}
