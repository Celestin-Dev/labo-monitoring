#include "../../include/network/WiFiManager.h"

#include "../../include/config/NetworkConfig.h"
#include "../../include/config/AppConfig.h"

void WiFiManager::begin() {

    WiFi.mode(WIFI_STA);

    WiFi.setAutoReconnect(true);

    WiFi.persistent(false);

    connect();
}

void WiFiManager::connect() {

    lastAttempt = millis();

    Serial.print("[WiFi] Connecting to ");
    Serial.println(WIFI_SSID);

    WiFi.begin(
        WIFI_SSID,
        WIFI_PASSWORD
    );

    unsigned long start = millis();

    while (
        WiFi.status() != WL_CONNECTED &&
        millis() - start < 10000
    ) {

        delay(250);

        Serial.print(".");
    }

    Serial.println();

    if (isConnected()) {

        Serial.println(
            "[WiFi] Connected"
        );

        Serial.print(
            "[WiFi] IP: "
        );

        Serial.println(
            WiFi.localIP()
        );

    } else {

        Serial.println(
            "[WiFi] Connection failed"
        );
    }
}

void WiFiManager::update() {

    if (isConnected()) {
        return;
    }

    if (
        millis() - lastAttempt
        >= HEARTBEAT_INTERVAL
    ) {

        connect();
    }
}

bool WiFiManager::isConnected() {

    return WiFi.status()
        == WL_CONNECTED;
}

String WiFiManager::getIPAddress() {

    if (!isConnected()) {

        return "0.0.0.0";
    }

    return WiFi.localIP().toString();
}