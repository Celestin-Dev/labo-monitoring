#pragma once

#include <Arduino.h>
#include <WiFi.h>

#include "../models/DeviceConfig.h"


class WiFiManager {

public:

    void begin(
        const DeviceConfig& config
    );

    void update();

    bool isConnected();

    String getIPAddress();

private:

    DeviceConfig config;

    unsigned long lastAttempt = 0;

    void connect();
};