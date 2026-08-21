#pragma once

// Adresse IP de votre broker MQTT
#define MQTT_BROKER       "172.17.0.1"

// Port MQTT standard
#define MQTT_PORT         1883

// Identifiants MQTT
#define MQTT_USERNAME     ""
#define MQTT_PASSWORD     ""

// Topics
//#define MQTT_MEASUREMENT_TOPIC "laboratory/measurements"
#define MQTT_HEARTBEAT_TOPIC   "laboratory/heartbeat"

// Identité MQTT
#define MQTT_CLIENT_ID    "ESP32-001"

// Intervalle de reconnexion
#define MQTT_RECONNECT_INTERVAL 5000