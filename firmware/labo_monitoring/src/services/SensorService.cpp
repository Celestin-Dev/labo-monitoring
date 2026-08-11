#include "../../include/sensors/SensorService.h"

#include <Arduino.h>

bool SensorService::begin() {

    bool result = true;

    result &= temperatureSensor.begin();
    result &= humiditySensor.begin();
    result &= coSensor.begin();
    result &= lightSensor.begin();
    result &= motionSensor.begin();
    result &= fireSensor.begin();

    return result;
}

SensorData SensorService::readAll() {

    SensorData data;

    data.temperature =
        temperatureSensor.read();

    data.humidity =
        humiditySensor.read();

    data.coRaw =
        coSensor.readRaw();

    data.luminosity =
        lightSensor.read();

    data.motionDetected =
        motionSensor.detected();

    data.fireDetected =
        fireSensor.detected();

    data.uptimeMs =
        millis();
    
    data.buzzerActive = fireSensor.detected() || motionSensor.detected();

    return data;
}