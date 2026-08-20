package com.labo.monitoring.mqtt;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hivemq.client.mqtt.mqtt5.Mqtt5AsyncClient;
import com.labo.monitoring.config.MqttProperties;

import lombok.extern.slf4j.Slf4j;

/**
 * Permet d'envoyer des commandes vers un ESP32 précis, ex : déclencher un
 * buzzer, couper une prise, forcer une re-calibration...
 * Topic : lab/{zoneId}/{deviceId}/commands
 */
@Slf4j
@Service
public class MqttPublisherService {

  @Autowired
  private Mqtt5AsyncClient mqttClient;

  @Autowired
  private MqttProperties mqttProperties;

  public void sendCommand(String zoneId, String deviceId, String commandJson) {
    String topic = String.format(mqttProperties.getTopics().getCommands(), zoneId, deviceId);

    mqttClient.publishWith()
        .topic(topic)
        .qos(MqttClientConfig.DEFAULT_QOS)
        .payload(commandJson.getBytes(StandardCharsets.UTF_8))
        .send()
        .whenComplete((publish, throwable) -> {
          if (throwable != null) {
            log.error("Échec de publication de commande sur {} : {}", topic, throwable.getMessage());
          } else {
            log.info("Commande publiée sur {} : {}", topic, commandJson);
          }
        });
  }
}
