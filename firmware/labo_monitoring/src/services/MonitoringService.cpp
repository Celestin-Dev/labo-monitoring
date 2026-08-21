#include "../include/sensors/MonitoringService.h"

#include <Arduino.h>

#include "../../include/config/AppConfig.h"
#include "../../include/config/PinConfig.h"

void MonitoringService::begin(SensorService *sensors, MqttClient *mqtt, const DeviceInfo *device)
{
    sensorService = sensors;
    mqttClient = mqtt;
    deviceInfo = device;
    lastMeasurement = 0;
}

void MonitoringService::update()
{
    if (sensorService == nullptr || deviceInfo == nullptr)
    {
        return;
    }

    unsigned long now = millis();

    if (
        now - lastMeasurement < MEASUREMENT_INTERVAL)
    {
        return;
    }

    lastMeasurement = now;

    SensorData data = sensorService->readAll();

    printData(data);

    handleLocalAlarm(data);

    // MQTT
    if (mqttClient != nullptr)
    {
        mqttClient->publishMeasurement(*deviceInfo, data);
    }

#if ENABLE_API_UPLOAD

    if (apiClient != nullptr)
    {

        apiClient->sendMeasurement(
            *deviceInfo,
            data);
    }

#endif
}

void MonitoringService::printData(const SensorData &data)
{
    Serial.println();
    Serial.println("============ SENSOR DATA ==========");
    Serial.printf("Temperature   : %.2f °C\n", data.temperature);
    Serial.printf("Humidity      : %.2f %%\n", data.humidity);
    Serial.printf("CO RAW        : %.0f\n", data.coRaw);
    Serial.printf("Luminosity    : %.2f %%\n", data.luminosity);
    Serial.printf("Motion        : %s\n", data.motionDetected ? "YES" : "NO");
    Serial.printf("Fire          : %s\n", data.fireDetected ? "YES" : "NO");
    Serial.println("Buzzer       : " + String(data.buzzerActive ? "ON" : "OFF"));
    Serial.println("=================================");
}

void MonitoringService::handleLocalAlarm(const SensorData &data)
{
#if ALARM_PIN >= 0

    if (data.fireDetected)
    {
        digitalWrite(ALARM_PIN, HIGH);
        Serial.println("[ALARM] FIRE DETECTED!");
    }
    else
    {
        digitalWrite(ALARM_PIN, LOW);
    }

#endif
}