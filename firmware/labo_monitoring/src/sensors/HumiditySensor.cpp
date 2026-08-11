#include "TemperatureSensor.h"
#include "../../include/config/PinConfig.h"

TemperatureSensor::TemperatureSensor()
    : dht(TEMP_SENSOR_PIN, DHT_TYPE),
      temperature(NAN) {
}

bool TemperatureSensor::begin() {

    dht.begin();

    delay(100);

    return true;
}

bool TemperatureSensor::update() {

    temperature = dht.readTemperature();

    return !isnan(temperature);
}

float TemperatureSensor::read() {

    temperature = dht.readTemperature();

    return temperature;
}