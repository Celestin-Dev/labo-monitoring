#pragma once

#include <Arduino.h>
#include "../config/AppConfig.h"

struct DeviceInfo {

    // Identifiant unique de l'ESP32
    String deviceId = DEVICE_ID;

    // Zone du laboratoire
    String zoneId = ZONE_ID;

    // Version du firmware
    String firmwareVersion = FIRMWARE_VERSION;
};