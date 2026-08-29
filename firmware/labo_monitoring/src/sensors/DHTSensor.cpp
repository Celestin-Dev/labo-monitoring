#include "../../include/sensors/DHTSensor.h"
#include "../../include/config/PinConfig.h"

DHTSensor::DHTSensor()
    : dht(TEMP_SENSOR_PIN, DHT_TYPE),
      temperature(0.0f),
      humidity(0.0f)
{
}

bool DHTSensor::begin()
{
  dht.begin();

  delay(100);

  return true;
}

bool DHTSensor::update()
{
  float newTemperature = dht.readTemperature();
  float newHumidity = dht.readHumidity();

  if (isnan(newTemperature) || isnan(newHumidity))
  {
    return false;
  }

  temperature = newTemperature;
  humidity = newHumidity;

  return true;
}

float DHTSensor::readTemperature()
{
  temperature = dht.readTemperature();
  return temperature;
}

float DHTSensor::readHumidity()
{
  humidity = dht.readHumidity();
  return humidity;
}

bool DHTSensor::isValid() const
{
  return !isnan(temperature) && !isnan(humidity);
}