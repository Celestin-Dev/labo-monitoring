package com.labo.monitoring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.labo.monitoring.dto.request.DeviceRequest;
import com.labo.monitoring.enums.DeviceStatus;
import com.labo.monitoring.exception.ResourceNotFoundException;
import com.labo.monitoring.model.Device;
import com.labo.monitoring.repository.DeviceRepository;

@Service
public class DeviceService {

  @Autowired
  private DeviceRepository deviceRepository;

  @Autowired
  private NotificationService notificationService;

  public List<Device> findAll() {
    return deviceRepository.findAll();
  }

  public List<Device> findByZone(String zoneId) {
    return deviceRepository.findByZoneId(zoneId);
  }

  public Device findById(String id) {
    return deviceRepository.findById(id)
        .orElseThrow(() -> ResourceNotFoundException.of("Appareil", id));
  }

  public Device create(DeviceRequest request) {
    Device device = new Device();
    device.setName(request.getName());
    device.setZoneId(request.getZoneId());
    device.setIpAddress(request.getIpAddress());
    device.setType(request.getType());
    device.setStatus(DeviceStatus.OFFLINE);
    return deviceRepository.save(device);
  }

  public Device update(String id, DeviceRequest request) {
    Device device = findById(id);
    device.setName(request.getName());
    device.setZoneId(request.getZoneId());
    device.setIpAddress(request.getIpAddress());
    device.setType(request.getType());
    return deviceRepository.save(device);
  }

  public void delete(String id) {
    if (!deviceRepository.existsById(id)) {
      throw ResourceNotFoundException.of("Appareil", id);
    }
    deviceRepository.deleteById(id);
  }

  /**
   * Résout un appareil STRICTEMENT par son nom au sein d'une zone donnée
   * (utilisé par le topic MQTT lab/{zoneName}/{deviceName}/...) — NE le crée
   * PAS s'il n'existe pas. L'appareil doit avoir été enregistré au préalable
   * via l'API/le frontend, avec exactement le même nom que celui saisi dans
   * le portail captif de l'ESP32 (recherche insensible à la casse).
   */
  public java.util.Optional<Device> findByNameInZone(String deviceName, String zoneId) {
    return deviceRepository.findByNameIgnoreCaseAndZoneId(deviceName, zoneId);
  }

  /**
   * Marque un appareil déjà résolu comme actif à l'instant présent.
   * Appelé à chaque message MQTT (mesure ou heartbeat) reçu d'un ESP32,
   * une fois l'appareil identifié via findByNameInZone.
   */
  public Device touchHeartbeat(String deviceId) {
    Device device = findById(deviceId);
    device.setLastHeartbeat(System.currentTimeMillis());

    boolean wasOffline = device.getStatus() == DeviceStatus.OFFLINE || device.getStatus() == null;
    device.setStatus(DeviceStatus.ONLINE);

    Device saved = deviceRepository.save(device);
    if (wasOffline) {
      notificationService.broadcastDeviceUpdate(saved);
    }
    return saved;
  }

  public Device updateStatus(String deviceId, DeviceStatus status) {
    Device device = findById(deviceId);
    if (device.getStatus() != status) {
      device.setStatus(status);
      device = deviceRepository.save(device);
      notificationService.broadcastDeviceUpdate(device);
    }
    return device;
  }

  public List<Device> findStaleDevices(long thresholdEpochMillis) {
    return deviceRepository.findByLastHeartbeatLessThan(thresholdEpochMillis);
  }
}
