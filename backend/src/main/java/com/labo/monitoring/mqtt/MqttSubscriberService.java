package com.labo.monitoring.mqtt;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.hivemq.client.mqtt.mqtt5.Mqtt5AsyncClient;
import com.labo.monitoring.config.MqttProperties;
import com.labo.monitoring.dto.mqtt.MqttMeasurementPayload;
import com.labo.monitoring.model.Device;
import com.labo.monitoring.model.Zone;
import com.labo.monitoring.service.DeviceService;
import com.labo.monitoring.service.MeasurementService;
import com.labo.monitoring.service.ZoneService;

import lombok.extern.slf4j.Slf4j;
import tools.jackson.databind.ObjectMapper;

/**
 * S'abonne aux topics MQTT publiés par les ESP32 et route les messages
 * reçus vers les services métier (mesures, heartbeat).
 *
 * Topics attendus :
 * - lab/{zoneName}/{deviceName}/measurements -> payload JSON
 * MqttMeasurementPayload
 * - lab/{zoneName}/{deviceName}/heartbeat -> payload libre (juste utilisé comme
 * "ping")
 *
 * SÉCURITÉ / PROVISIONING STRICT :
 * {zoneName} et {deviceName} sont des noms lisibles (ex: "zoneA", "esp32-a1"),
 * exactement ceux saisis côté ESP32 via le portail captif. Le backend ne les
 * crée PLUS automatiquement : la zone et l'appareil doivent avoir été
 * enregistrés au préalable via l'API/le frontend (mêmes noms, recherche
 * insensible à la casse). Si l'un des deux est introuvable, le message est
 * journalisé en warning et purement et simplement REJETÉ (aucune écriture
 * en base) — ça empêche un appareil non provisionné, ou mal configuré côté
 * portail captif, d'injecter des données.
 */
@Slf4j
@Service
public class MqttSubscriberService {

  @Autowired
  private Mqtt5AsyncClient mqttClient;

  @Autowired
  private MqttProperties mqttProperties;

  @Autowired
  private MeasurementService measurementService;

  @Autowired
  private DeviceService deviceService;

  @Autowired
  private ZoneService zoneService;

  private final ObjectMapper objectMapper = new ObjectMapper();

  @EventListener(ApplicationReadyEvent.class)
  public void subscribeToTopics() {
    subscribe(mqttProperties.getTopics().getMeasurements(), this::handleMeasurement);
    subscribe(mqttProperties.getTopics().getHeartbeat(), this::handleHeartbeat);
  }

  private void subscribe(String topicFilter, java.util.function.BiConsumer<String, String> handler) {
    mqttClient.subscribeWith()
        .topicFilter(topicFilter)
        .qos(MqttClientConfig.DEFAULT_QOS)
        .callback(publish -> {
          String topic = publish.getTopic().toString();
          String payload = new String(publish.getPayloadAsBytes(), StandardCharsets.UTF_8);
          try {
            handler.accept(topic, payload);
          } catch (Exception e) {
            log.error("Erreur de traitement du message MQTT sur {} : {}", topic, e.getMessage(), e);
          }
        })
        .send()
        .whenComplete((subAck, throwable) -> {
          if (throwable != null) {
            log.error("Échec d'abonnement au topic {} : {}", topicFilter, throwable.getMessage());
          } else {
            log.info("Abonné au topic MQTT : {}", topicFilter);
          }
        });
  }

  /**
   * Résout strictement zoneName -> Zone et deviceName -> Device.
   * Retourne null (et journalise le rejet) si l'un des deux est introuvable.
   */
  private Device resolveDeviceStrict(String zoneName, String deviceName) {
    Zone zone = zoneService.findByName(zoneName).orElse(null);
    if (zone == null) {
      log.warn("Message MQTT REJETÉ : zone \"{}\" non enregistrée (aucune zone avec ce nom en base). "
          + "Créez-la via Configuration > Zones avant de connecter cet appareil.", zoneName);
      return null;
    }

    Device device = deviceService.findByNameInZone(deviceName, zone.getId()).orElse(null);
    if (device == null) {
      log.warn("Message MQTT REJETÉ : appareil \"{}\" non enregistré dans la zone \"{}\". "
          + "Créez-le via la page Appareils avec exactement ce nom avant de le connecter.", deviceName, zoneName);
      return null;
    }

    return device;
  }

  private void handleMeasurement(String topic, String payloadJson) {
    try {
      String[] parts = topic.split("/");
      if (parts.length < 4) {
        log.warn("Topic de mesure inattendu, ignoré : {}", topic);
        return;
      }
      String zoneName = parts[1];
      String deviceName = parts[2];

      Device device = resolveDeviceStrict(zoneName, deviceName);
      if (device == null) {
        return; // rejeté : zone/appareil non provisionné
      }

      MqttMeasurementPayload payload = objectMapper.readValue(payloadJson, MqttMeasurementPayload.class);
      log.debug("Mesure reçue - zone={}, device={} ({}), payload={}", zoneName, deviceName, device.getId(), payload);

      deviceService.touchHeartbeat(device.getId());
      measurementService.ingest(device.getZoneId(), device.getId(), payload);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void handleHeartbeat(String topic, String payloadJson) {
    String[] parts = topic.split("/");
    if (parts.length < 4) {
      log.warn("Topic de heartbeat inattendu, ignoré : {}", topic);
      return;
    }
    String zoneName = parts[1];
    String deviceName = parts[2];

    Device device = resolveDeviceStrict(zoneName, deviceName);
    if (device == null) {
      return; // rejeté : zone/appareil non provisionné
    }
    deviceService.touchHeartbeat(device.getId());
  }
}
