#pragma once

#include <Arduino.h>
#include "../../include/interfaces/ISensor.h"

class MotionSensor : public ISensor {

public:
    bool begin() override;
    bool update() override;

    bool detected();

private:
    bool motionDetected = false;
};