#pragma once

#include <Arduino.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include <WiFi.h>

#include "../../include/models/SensorData.h"
#include "../../include/models/DeviceInfo.h"

class MqttClient {

public:

    MqttClient();

    void begin();

    void update();

    bool connect();

    bool isConnected();

    bool publishMeasurement(
        const DeviceInfo& device,
        const SensorData& data
    );

    bool publishHeartbeat(
        const DeviceInfo& device,
        const String& ip
    );

private:

    WiFiClient wifiClient;

    PubSubClient mqttClient;

    unsigned long lastReconnectAttempt = 0;

    String buildMeasurementJson(
        const SensorData& data
    );

    String buildHeartbeatJson(
        const DeviceInfo& device,
        const String& ip
    );

    void reconnect();
};