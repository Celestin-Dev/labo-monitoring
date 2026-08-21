#pragma once

#include <Arduino.h>

struct DeviceConfig
{

    String deviceId;

    String zoneId;

    String wifiSsid;

    String wifiPassword;

    bool configured = false;
};