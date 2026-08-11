#include "../../include/sensors/COSensor.h"
#include "../../include/config/PinConfig.h"
COSensor :: COSensor() : _rawAnalogValue(0.0f) {}
bool COSensor::begin(){
    pinMode(CO_SENSOR_PIN, INPUT);
    return true;
}
bool COSensor::update(){
    int adcValue=analogRead(CO_SENSOR_PIN);
    float _rawAnalogValue=static_cast<float>(adcValue);
    return true;
}

float COSensor::readRaw(){
    return _rawAnalogValue;
}