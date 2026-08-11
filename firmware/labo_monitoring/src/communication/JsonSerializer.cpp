#include "JsonSerializer.h"

#include <ArduinoJson.h>

String JsonSerializer::measurementToJson(
    const DeviceInfo& device,
    const SensorData& data
) {

    JsonDocument doc;

    doc["deviceId"] =
        device.deviceId;

    doc["zoneId"] =
        device.zoneId;

    if (!isnan(data.temperature)) {

        doc["temperature"] =
            data.temperature;
    }

    if (!isnan(data.humidity)) {

        doc["humidity"] =
            data.humidity;
    }

    if (!isnan(data.coRaw)) {

        doc["coRaw"] =
            data.coRaw;
    }

    if (!isnan(data.luminosity)) {

        doc["luminosity"] =
            data.luminosity;
    }

    doc["motionDetected"] =
        data.motionDetected;

    doc["fireDetected"] =
        data.fireDetected;

    doc["uptimeMs"] =
        data.uptimeMs;

    String json;

    serializeJson(
        doc,
        json
    );

    return json;
}

String JsonSerializer::heartbeatToJson(
    const DeviceInfo& device,
    const String& ip
) {

    JsonDocument doc;

    doc["deviceId"] =
        device.deviceId;

    doc["zoneId"] =
        device.zoneId;

    doc["firmwareVersion"] =
        device.firmwareVersion;

    doc["ipAddress"] =
        ip;

    doc["uptimeMs"] =
        millis();

    String json;

    serializeJson(
        doc,
        json
    );

    return json;
}