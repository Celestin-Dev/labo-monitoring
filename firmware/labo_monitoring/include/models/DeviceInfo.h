#pragma once

#include <Arduino.h>

#include "DeviceConfig.h"


struct DeviceInfo {

    String deviceId;

    String zoneId;

    String firmwareVersion;


    void load(
        const DeviceConfig& config
    )
    {
        deviceId =
            config.deviceId;

        zoneId =
            config.zoneId;

        firmwareVersion =
            deviceId + "-v1.0.0";
    }
};