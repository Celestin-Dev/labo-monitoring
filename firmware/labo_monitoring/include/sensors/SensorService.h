#pragma once

#include "../../include/models/SensorData.h"

#include "../sensors/COSensor.h"
#include "../sensors/LightSensor.h"
#include "../sensors/MotionSensor.h"
#include "../sensors/FireSensor.h"
#include "../sensors/DHTSensor.h"

class SensorService
{

public:
    bool begin();

    SensorData readAll();

private:
    COSensor coSensor;

    LightSensor lightSensor;

    MotionSensor motionSensor;

    FireSensor fireSensor;
    DHTSensor dhtSensor;
};