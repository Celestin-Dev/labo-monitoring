#pragma once

#include <Arduino.h>
#include <DHT.h>
#include "../../include/interfaces/ISensor.h"
#define DHT_TYPE DHT22

class HumiditySensor : public ISensor {

public:
    HumiditySensor();

    bool begin() override;
    bool update() override;

    float read();

private:
    DHT dht;
    float humidity;
};