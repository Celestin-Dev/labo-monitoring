#include <Arduino.h>

#include "../include/storage/ConfigStorage.h"

#include "../include/network/ConfigPortal.h"
#include "../include/network/WiFiManager.h"
#include "../include/network/MqttClient.h"

#include "../include/models/DeviceConfig.h"
#include "../include/models/DeviceInfo.h"

#include "../include/sensors/SensorService.h"
#include "../include/sensors/MonitoringService.h"


ConfigStorage configStorage;

ConfigPortal configPortal(
    &configStorage
);

WiFiManager wifiManager;

MqttClient mqttClient;

SensorService sensorService;

MonitoringService monitoringService;

DeviceConfig deviceConfig;

DeviceInfo deviceInfo;


bool configurationMode = false;


void setup()
{
    Serial.begin(115200);

    delay(1000);


    Serial.println();

    Serial.println(
        "===================================="
    );

    Serial.println(
        " Laboratory Monitoring Using ESP32"
    );

    Serial.println(
        "====================================="
    );


    // NVS
    if (!configStorage.begin()) {

        Serial.println(
            "[STORAGE] NVS initialization failed"
        );

        return;
    }


    // Vérifier configuration
    bool configured =
        configStorage.isConfigured();


    if (!configured) {

        Serial.println(
            "[SYSTEM] No configuration found"
        );

        Serial.println(
            "[SYSTEM] Starting CONFIGURATION mode"
        );


        configurationMode =
            true;


        configPortal.begin();

        return;
    }


    // Charger configuration
    if (
        !configStorage.load(
            deviceConfig
        )
    ) {

        Serial.println(
            "[SYSTEM] Failed to load configuration"
        );

        configurationMode =
            true;

        configPortal.begin();

        return;
    }


    Serial.println();

    Serial.println(
        "[SYSTEM] Configuration loaded"
    );

    Serial.print(
        "[SYSTEM] Device ID: "
    );

    Serial.println(
        deviceConfig.deviceId
    );

    Serial.print(
        "[SYSTEM] Zone ID: "
    );

    Serial.println(
        deviceConfig.zoneId
    );

    // DeviceInfo
    deviceInfo.load(
        deviceConfig
    );


    // Sensors
    if (
        sensorService.begin()
    ) {

        Serial.println(
            "[SENSOR] Initialized successfully"
        );

    } else {

        Serial.println(
            "[SENSOR] Initialization failed"
        );
    }


    // WiFi STA
    wifiManager.begin(
        deviceConfig
    );


    // MQTT
    mqttClient.begin(
        deviceConfig
    );

    mqttClient.connect();


    // Monitoring
    monitoringService.begin(
        &sensorService,
        &mqttClient,
        &deviceInfo
    );


    Serial.println();

    Serial.println(
        "[SYSTEM] NORMAL MODE"
    );
}


void loop()
{
    // Configuration mode
    if (configurationMode) {

        configPortal.update();

        delay(10);

        return;
    }


    // Normal mode
    wifiManager.update();

    mqttClient.update();

    monitoringService.update();


    delay(100);
}