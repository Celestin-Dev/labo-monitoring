#pragma once

#include <Arduino.h>

#include "../../include/models/SensorData.h"
#include "../../include/models/DeviceInfo.h"

class JsonSerializer {

public:

    String measurementToJson(
        const DeviceInfo& device,
        const SensorData& data
    );

    String heartbeatToJson(
        const DeviceInfo& device,
        const String& ip
    );
};