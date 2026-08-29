#include "../../include/sensors/COSensor.h"
#include "../../include/config/PinConfig.h"

COSensor ::COSensor() : _rawAnalogValue(0.0f) {}

bool COSensor::begin()
{
    pinMode(CO_SENSOR_PIN, INPUT);
    analogReadResolution(12);
    return true;
}
bool COSensor::update()
{
    int adcValue = analogRead(CO_SENSOR_PIN);
    _rawAnalogValue = static_cast<float>(adcValue);
    return true;
}

float COSensor::readRaw()
{
    int adcValue = analogRead(CO_SENSOR_PIN);
    _rawAnalogValue = static_cast<float>(adcValue);
    return _rawAnalogValue;
}