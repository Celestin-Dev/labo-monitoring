#pragma once

#include <Arduino.h>
#include <WiFi.h>

class WiFiManager {

public:
    void begin();
    void update();

    bool isConnected();

    String getIPAddress();

private:
    unsigned long lastAttempt = 0;

    void connect();
}; 