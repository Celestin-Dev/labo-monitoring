#pragma once

#include <Arduino.h>
#include <WiFiClient.h>
#include <PubSubClient.h>
#include <WiFi.h>

#include "../models/SensorData.h"
#include "../models/DeviceInfo.h"
#include "../models/DeviceConfig.h"
#include "../config/MqttConfig.h"

class MqttClient
{

public:
    MqttClient();

    void begin(
        const DeviceConfig &config);

    void update();

    bool connect();

    bool isConnected();

    bool publishMeasurement(
        const DeviceInfo &device,
        const SensorData &data);

private:
    WiFiClient wifiClient;

    PubSubClient mqttClient;

    DeviceConfig config;

    unsigned long lastReconnectAttempt = 0;

    String buildMeasurementJson(
        const SensorData &data);
};