#include "../../include/storage/ConfigStorage.h"

#include <Preferences.h>

static Preferences preferences;


bool ConfigStorage::begin()
{
    return preferences.begin(
        NAMESPACE,
        false
    );
}


bool ConfigStorage::isConfigured()
{
    return preferences.getBool(
        "configured",
        false
    );
}


bool ConfigStorage::load(
    DeviceConfig& config
)
{
    if (!isConfigured()) {
        return false;
    }

    config.deviceId =
        preferences.getString(
            "deviceId",
            ""
        );

    config.zoneId =
        preferences.getString(
            "zoneId",
            ""
        );

    config.wifiSsid =
        preferences.getString(
            "wifiSsid",
            ""
        );

    config.wifiPassword =
        preferences.getString(
            "wifiPass",
            ""
        );

    config.mqttBroker =
        preferences.getString(
            "mqttBroker",
            ""
        );

    config.mqttPort =
        preferences.getUShort(
            "mqttPort",
            1883
        );

    config.configured = true;

    return true;
}


bool ConfigStorage::save(
    const DeviceConfig& config
)
{
    if (
        config.deviceId.isEmpty() ||
        config.zoneId.isEmpty() ||
        config.wifiSsid.isEmpty() ||
        config.mqttBroker.isEmpty()
    ) {
        return false;
    }

    preferences.putString(
        "deviceId",
        config.deviceId
    );

    preferences.putString(
        "zoneId",
        config.zoneId
    );

    preferences.putString(
        "wifiSsid",
        config.wifiSsid
    );

    preferences.putString(
        "wifiPass",
        config.wifiPassword
    );

    preferences.putString(
        "mqttBroker",
        config.mqttBroker
    );

    preferences.putUShort(
        "mqttPort",
        config.mqttPort
    );

    preferences.putBool(
        "configured",
        true
    );

    return true;
}


bool ConfigStorage::clear()
{
    return preferences.clear();
}