#pragma once
#include <Arduino.h>
#include "interfaces/ISensor.h"

class COSensor : public ISensor
{
private:
    float _rawAnalogValue;

public:
    COSensor();
    bool begin() override;
    bool update() override;
    float readRaw();
};