package com.labo.monitoring.mqtt;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hivemq.client.mqtt.mqtt5.Mqtt5AsyncClient;
import com.labo.monitoring.config.MqttProperties;
import com.labo.monitoring.dto.mqtt.MqttMeasurementPayload;
import com.labo.monitoring.service.DeviceService;
import com.labo.monitoring.service.MeasurementService;

import lombok.extern.slf4j.Slf4j;

/**
 * S'abonne aux topics MQTT publiés par les ESP32 et route les messages
 * reçus vers les services métier (mesures, heartbeat).
 *
 * Topics attendus :
 * - lab/{zoneId}/{deviceId}/measurements -> payload JSON MqttMeasurementPayload
 * - lab/{zoneId}/{deviceId}/heartbeat -> payload libre (juste utilisé comme
 * "ping")
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

  private final ObjectMappe objectMapper = new ObjectMapper();

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
   * Extrait zoneId/deviceId depuis le topic
   * "lab/{zoneId}/{deviceId}/measurements".
   */
  private void handleMeasurement(String topic, String payloadJson) throws Exception {
    String[] parts = topic.split("/");
    if (parts.length < 4) {
      log.warn("Topic de mesure inattendu, ignoré : {}", topic);
      return;
    }
    String zoneId = parts[1];
    String deviceId = parts[2];

    MqttMeasurementPayload payload = objectMapper.readValue(payloadJson, MqttMeasurementPayload.class);
    log.debug("Mesure reçue - zone={}, device={}, payload={}", zoneId, deviceId, payload);

    measurementService.ingest(zoneId, deviceId, payload);
    deviceService.registerHeartbeat(deviceId, zoneId);
  }

  private void handleHeartbeat(String topic, String payloadJson) {
    String[] parts = topic.split("/");
    if (parts.length < 4) {
      log.warn("Topic de heartbeat inattendu, ignoré : {}", topic);
      return;
    }
    String zoneId = parts[1];
    String deviceId = parts[2];
    deviceService.registerHeartbeat(deviceId, zoneId);
  }
}
