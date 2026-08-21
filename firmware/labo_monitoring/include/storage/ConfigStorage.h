#pragma once

#include <Arduino.h>

#include "../models/DeviceConfig.h"

class ConfigStorage {

public:

    bool begin();

    bool isConfigured();

    bool load(DeviceConfig& config);

    bool save(const DeviceConfig& config);

    bool clear();

private:

    static constexpr const char* NAMESPACE = "lab-config";
};