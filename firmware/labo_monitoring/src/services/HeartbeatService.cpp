#include "../../include/sensors/HeartbeatService.h"

#include "../../include/config/AppConfig.h"

void HeartbeatService::begin(
    ApiClient* api,
    const DeviceInfo* device,
    String (*ipProvider)()
) {

    apiClient = api;

    deviceInfo = device;

    getIp = ipProvider;

    lastHeartbeat = 0;
}

void HeartbeatService::update() {

    if (
        apiClient == nullptr ||
        deviceInfo == nullptr ||
        getIp == nullptr
    ) {
        return;
    }

    unsigned long now =
        millis();

    if (
        now - lastHeartbeat
        < HEARTBEAT_INTERVAL
    ) {
        return;
    }

    lastHeartbeat = now;

    String ip =
        getIp();

    apiClient->sendHeartbeat(
        *deviceInfo,
        ip
    );
}