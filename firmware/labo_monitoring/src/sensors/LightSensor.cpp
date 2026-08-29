#include "../../include/sensors/LightSensor.h"
#include "../../include/config/PinConfig.h"

LightSensor::LightSensor()
    : _rawAnalogValue(0.0f),
      _luminosity(0.0f)
{
}

bool LightSensor::begin()
{
    pinMode(LIGHT_SENSOR_PIN, INPUT);

    // ADC ESP32 : 12 bits
    analogReadResolution(12);

    return true;
}

bool LightSensor::update()
{
    int adcValue = analogRead(LIGHT_SENSOR_PIN);

    _rawAnalogValue = static_cast<float>(adcValue);

    // Conversion en pourcentage
    _luminosity = (_rawAnalogValue / 4095.0f) * 100.0f;

    return true;
}

float LightSensor::readRaw()
{
    return _rawAnalogValue;
}

float LightSensor::read()
{
    return _luminosity;
}