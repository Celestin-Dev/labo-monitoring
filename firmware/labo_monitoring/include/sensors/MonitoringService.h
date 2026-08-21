#pragma once

#include "../../include/models/DeviceInfo.h"

#include "../sensors/SensorService.h"
#include "../network/MqttClient.h"

class MonitoringService {

public:

    void begin(
        SensorService* sensors,
        MqttClient* mqtt,
        const DeviceInfo* device
    );

    void update();

    void printData(
        const SensorData& data
    );

    void handleLocalAlarm(
        const SensorData& data
    );

private:

    SensorService* sensorService = nullptr;

    MqttClient* mqttClient = nullptr;

    const DeviceInfo* deviceInfo = nullptr;

    unsigned long lastMeasurement = 0;
};