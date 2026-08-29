package com.labo.monitoring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.labo.monitoring.dto.request.ZoneRequest;
import com.labo.monitoring.enums.ZoneStatus;
import com.labo.monitoring.exception.ResourceNotFoundException;
import com.labo.monitoring.model.Zone;
import com.labo.monitoring.repository.ZoneRepository;

@Service
public class ZoneService {

  @Autowired
  private ZoneRepository zoneRepository;

  @Autowired
  private NotificationService notificationService;

  public List<Zone> findAll() {
    return zoneRepository.findAll();
  }

  public Zone findById(String id) {
    return zoneRepository.findById(id)
        .orElseThrow(() -> ResourceNotFoundException.of("Zone", id));
  }

  public Zone create(ZoneRequest request) {
    Zone zone = new Zone();
    zone.setName(request.getName());
    zone.setDescription(request.getDescription());
    zone.setStatus(ZoneStatus.NORMAL);
    return zoneRepository.save(zone);
  }

  public Zone update(String id, ZoneRequest request) {
    Zone zone = findById(id);
    zone.setName(request.getName());
    zone.setDescription(request.getDescription());
    return zoneRepository.save(zone);
  }

  public void delete(String id) {
    if (!zoneRepository.existsById(id)) {
      throw ResourceNotFoundException.of("Zone", id);
    }
    zoneRepository.deleteById(id);
  }

  /**
   * Résout une zone STRICTEMENT par son nom (utilisé par le topic MQTT
   * lab/{zoneName}/...) — NE la crée PAS si elle n'existe pas. La zone doit
   * avoir été enregistrée au préalable via l'API/le frontend (Configuration
   * > Zones), exactement comme elle doit l'être via le portail captif côté
   * ESP32. Retourne vide si aucune correspondance : c'est au MqttSubscriberService
   * de décider de rejeter le message dans ce cas.
   */
  public java.util.Optional<Zone> findByName(String zoneName) {
    return zoneRepository.findByNameIgnoreCase(zoneName);
  }

  /** Met à jour le statut d'une zone (appelé par le moteur d'évaluation d'alertes) et notifie le frontend. */
  public Zone updateStatus(String zoneId, ZoneStatus status) {
    Zone zone = findById(zoneId);
    if (zone.getStatus() != status) {
      zone.setStatus(status);
      zone = zoneRepository.save(zone);
      notificationService.broadcastZoneUpdate(zone);
    }
    return zone;
  }
}
