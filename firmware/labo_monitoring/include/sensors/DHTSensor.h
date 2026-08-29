#pragma once

#include <DHT.h>
#define DHT_TYPE DHT11

class DHTSensor
{
private:
  DHT dht;

  float temperature;
  float humidity;

public:
  DHTSensor();

  bool begin();

  bool update();

  float readTemperature();

  float readHumidity();

  bool isValid() const;
};