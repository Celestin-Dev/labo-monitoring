#pragma once

#include "../../include/models/SensorData.h"

#include "../sensors/TemperatureSensor.h"
#include "../sensors/HumiditySensor.h"
#include "../sensors/COSensor.h"
#include "../sensors/LightSensor.h"
#include "../sensors/MotionSensor.h"
#include "../sensors/FireSensor.h"

class SensorService {

public:

    bool begin();

    SensorData readAll();

private:

    TemperatureSensor temperatureSensor;

    HumiditySensor humiditySensor;

    COSensor coSensor;

    LightSensor lightSensor;

    MotionSensor motionSensor;

    FireSensor fireSensor;
};