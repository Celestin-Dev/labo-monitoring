#pragma once

#include <Arduino.h>

#include "../../include/models/DeviceInfo.h"
#include "../network/ApiClient.h"

class HeartbeatService {

public:

    void begin(
        ApiClient* api,
        const DeviceInfo* device,
        String (*ipProvider)()
    );

    void update();

private:

    ApiClient* apiClient = nullptr;

    const DeviceInfo* deviceInfo = nullptr;

    String (*getIp)() = nullptr;

    unsigned long lastHeartbeat = 0;
};