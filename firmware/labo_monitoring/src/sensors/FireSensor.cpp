#include "../../include/sensors/FireSensor.h"
#include "../../include/config/PinConfig.h"

bool FireSensor::begin() {

    pinMode(
        PIR_SENSOR_PIN,
        INPUT
    );

    return true;
}

bool FireSensor::update() {

    int value = digitalRead(PIR_SENSOR_PIN);

#if FIRE_ACTIVE_LOW
    fireDetected = value == LOW;
#else
    fireDetected = value == HIGH;
#endif

    return true;
}

bool FireSensor::detected() {

    update();

    return fireDetected;
}