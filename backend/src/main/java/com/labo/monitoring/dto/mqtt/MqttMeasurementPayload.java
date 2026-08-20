package com.labo.monitoring.dto.mqtt;

import lombok.Data;

/**
 * Représente le JSON publié par l'ESP32 sur le topic MQTT
 * "lab/{zoneId}/{deviceId}/measurements".
 *
 * Exemple de payload attendu :
 * {
 * "temperature": 24,
 * "humidity": 54,
 * "coRaw": 7,
 * "luminosity": 120,
 * "motionDetected": false,
 * "fireDetected": false,
 * "timestamp": 1755680000000
 * }
 *
 * Le champ "timestamp" est optionnel : si absent, le backend utilise
 * l'heure de réception du message.
 */
@Data
public class MqttMeasurementPayload {

  private int temperature;
  private int humidity;
  private int coRaw;
  private int luminosity;
  private boolean motionDetected;
  private boolean fireDetected;
  private Long timestamp;
}
