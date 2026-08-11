#pragma once

#include "../../include/models/DeviceInfo.h"

#include "../sensors/SensorService.h"
#include "../network/ApiClient.h"

class MonitoringService {

public:

    void begin(
        SensorService* sensors,
        ApiClient* api,
        const DeviceInfo* device
    );

    void update();

private:

    SensorService* sensorService = nullptr;

    ApiClient* apiClient = nullptr;

    const DeviceInfo* deviceInfo = nullptr;

    unsigned long lastMeasurement = 0;

    void printData(
        const SensorData& data
    );

    void handleLocalAlarm(
        const SensorData& data
    );
};