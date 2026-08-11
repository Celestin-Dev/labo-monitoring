#include "../../include/sensors/MotionSensor.h"
#include "../../include/config/PinConfig.h"

bool MotionSensor::begin() {

    pinMode(
        PIR_SENSOR_PIN,
        INPUT
    );

    return true;
}

bool MotionSensor::update() {

    motionDetected =
        digitalRead(PIR_SENSOR_PIN) == HIGH;

    return true;
}

bool MotionSensor::detected() {

    motionDetected =
        digitalRead(PIR_SENSOR_PIN) == HIGH;

    return motionDetected;
}