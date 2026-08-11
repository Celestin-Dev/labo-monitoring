#include "../include/sensors/MonitoringService.h"

#include <Arduino.h>

#include "../../include/config/AppConfig.h"
#include "../../include/config/PinConfig.h"

void MonitoringService::begin(
    SensorService* sensors,
    ApiClient* api,
    const DeviceInfo* device
) {

    sensorService = sensors;

    apiClient = api;

    deviceInfo = device;

    lastMeasurement = 0;
}

void MonitoringService::update() {

    if (
        sensorService == nullptr ||
        apiClient == nullptr ||
        deviceInfo == nullptr
    ) {
        return;
    }

    unsigned long now =
        millis();

    if (
        now - lastMeasurement
        < MEASUREMENT_INTERVAL_MS
    ) {
        return;
    }

    lastMeasurement = now;

    SensorData data =
        sensorService->readAll();

    printData(data);

    handleLocalAlarm(data);

#if ENABLE_API_UPLOAD

    apiClient->sendMeasurement(
        *deviceInfo,
        data
    );

#endif
}

void MonitoringService::printData(
    const SensorData& data
) {

    Serial.println();
    Serial.println(
        "========== SENSOR DATA =========="
    );

    Serial.printf(
        "Temperature : %.2f °C\n",
        data.temperature
    );

    Serial.printf(
        "Humidity    : %.2f %%\n",
        data.humidity
    );

    Serial.printf(
        "CO RAW      : %.0f\n",
        data.coRaw
    );

    Serial.printf(
        "Luminosity  : %.2f lux\n",
        data.luminosity
    );

    Serial.printf(
        "Motion      : %s\n",
        data.motionDetected
            ? "YES"
            : "NO"
    );

    Serial.printf(
        "Fire        : %s\n",
        data.fireDetected
            ? "YES"
            : "NO"
    );

    Serial.println(
        "================================="
    );
}

void MonitoringService::handleLocalAlarm(
    const SensorData& data
) {

#if ALARM_PIN >= 0

    if (data.fireDetected) {

        digitalWrite(
            ALARM_PIN,
            HIGH
        );

        Serial.println(
            "[ALARM] FIRE DETECTED!"
        );

    } else {

        digitalWrite(
            ALARM_PIN,
            LOW
        );
    }

#endif
}