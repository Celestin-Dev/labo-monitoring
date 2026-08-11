#pragma once

#include <Arduino.h>

#include "../../include/models/SensorData.h"
#include "../../include/models/DeviceInfo.h"

#include "../../include/com/HttpClient.h"
#include "../../include/com/JsonSerializer.h"

class ApiClient {

public:

    bool sendMeasurement(
        const DeviceInfo& device,
        const SensorData& data
    );

    bool sendHeartbeat(
        const DeviceInfo& device,
        const String& ip
    );

private:

    HttpClient httpClient;

    JsonSerializer serializer;
};