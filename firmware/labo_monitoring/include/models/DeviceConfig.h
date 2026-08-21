#pragma once

#include <Arduino.h>

struct DeviceConfig {

    String deviceId;

    String zoneId;

    String wifiSsid;

    String wifiPassword;

    String mqttBroker;

    uint16_t mqttPort = 1883;

    bool configured = false;
};