#pragma once

#include <Arduino.h>

#include "../../include/interfaces/ISensor.h"

class LightSensor : public ISensor {

public:
    bool begin() override;
    bool update() override;

    float read();

private:
    int pin;
    float luminosity = NAN;
};