#include "../../include/network/ApiClient.h"

#include "../../include/config/NetworkConfig.h"

bool ApiClient::sendMeasurement(
    const DeviceInfo& device,
    const SensorData& data
) {

    String url =
        String(API_BASE_URL)
        + MEASUREMENTS_ENDPOINT;

    String json =
        serializer.measurementToJson(
            device,
            data
        );

    int statusCode;

    return httpClient.postJson(
        url,
        json,
        statusCode
    );
}

bool ApiClient::sendHeartbeat(
    const DeviceInfo& device,
    const String& ip
) {

    String url =
        String(API_BASE_URL)
        + HEARTBEAT_ENDPOINT;

    String json =
        serializer.heartbeatToJson(
            device,
            ip
        );

    int statusCode;

    return httpClient.postJson(
        url,
        json,
        statusCode
    );
}