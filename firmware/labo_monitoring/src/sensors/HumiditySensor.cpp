#include "../../include/sensors/HumiditySensor.h"
#include "../../include/config/PinConfig.h"

HumiditySensor::HumiditySensor()
    : dht(TEMP_SENSOR_PIN, DHT_TYPE),
      humidity(NAN) {
}

bool HumiditySensor::begin() {

    dht.begin();

    delay(100);

    return true;
}

bool HumiditySensor::update() {

    humidity = dht.readHumidity();

    return !isnan(humidity);
}

float HumiditySensor::read() {

    humidity = dht.readHumidity();

    return humidity;
}