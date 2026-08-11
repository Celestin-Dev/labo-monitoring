#pragma once

#include <Arduino.h>
#include "interfaces/ISensor.h"

class LightSensor : public ISensor {

private:
    float _rawAnalogValue;
    float _luminosity;

public:
    LightSensor();

    bool begin() override;
    bool update() override;

    float readRaw();
    float read();
};