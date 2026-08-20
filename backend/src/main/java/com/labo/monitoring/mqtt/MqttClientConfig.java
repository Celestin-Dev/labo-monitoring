package com.labo.monitoring.mqtt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hivemq.client.mqtt.MqttClient;
import com.hivemq.client.mqtt.datatypes.MqttQos;
import com.hivemq.client.mqtt.mqtt5.Mqtt5AsyncClient;
import com.hivemq.client.mqtt.mqtt5.message.connect.connack.Mqtt5ConnAck;
import com.labo.monitoring.config.MqttProperties;

import lombok.extern.slf4j.Slf4j;

/**
 * Construit et connecte le client MQTT (protocole 5) utilisé pour dialoguer
 * avec le broker HiveMQ auquel les ESP32 publient leurs mesures.
 */
@Slf4j
@Configuration
public class MqttClientConfig {

  @Autowired
  private MqttProperties mqttProperties;

  @Bean(destroyMethod = "disconnect")
  public Mqtt5AsyncClient mqttClient() {
    var clientBuilder = MqttClient.builder()
        .useMqttVersion5()
        .identifier(mqttProperties.getClientId() + "-" + System.currentTimeMillis())
        .serverHost(mqttProperties.getHost())
        .serverPort(mqttProperties.getPort());

    if (mqttProperties.isUseSsl()) {
      clientBuilder.sslWithDefaultConfig();
    }

    Mqtt5AsyncClient client = clientBuilder.buildAsync();

    var connectBuilder = client.connectWith()
        .cleanStart(true)
        .keepAlive(30);

    if (mqttProperties.getUsername() != null && !mqttProperties.getUsername().isBlank()) {
      connectBuilder = connectBuilder.simpleAuth()
          .username(mqttProperties.getUsername())
          .password(mqttProperties.getPassword().getBytes())
          .applySimpleAuth();
    }

    connectBuilder.send().whenComplete((Mqtt5ConnAck ack, Throwable throwable) -> {
      if (throwable != null) {
        log.error("Connexion MQTT échouée vers {}:{} -> {}",
            mqttProperties.getHost(), mqttProperties.getPort(), throwable.getMessage());
      } else {
        log.info("Connecté au broker MQTT {}:{}", mqttProperties.getHost(), mqttProperties.getPort());
      }
    });

    return client;
  }

  /** QoS utilisée pour les abonnements/publications des mesures capteurs. */
  public static final MqttQos DEFAULT_QOS = MqttQos.AT_LEAST_ONCE;
}
