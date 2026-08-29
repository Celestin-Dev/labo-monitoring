#include "../../include/sensors/SensorService.h"

#include <Arduino.h>

bool SensorService::begin()
{

    bool result = true;

    result &= dhtSensor.begin();
    result &= coSensor.begin();
    result &= lightSensor.begin();
    result &= motionSensor.begin();
    result &= fireSensor.begin();

    return result;
}

SensorData SensorService::readAll()
{

    SensorData data;

    data.temperature = dhtSensor.readTemperature();

    data.humidity = dhtSensor.readHumidity();

    data.coRaw = coSensor.readRaw();

    data.luminosity = lightSensor.read();

    data.motionDetected = motionSensor.detected();

    data.fireDetected = fireSensor.detected();

    data.uptimeMs = millis();

    data.buzzerActive = fireSensor.detected() || motionSensor.detected();

    return data;
}