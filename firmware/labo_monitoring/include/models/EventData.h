#pragma once

#include <Arduino.h>

enum class EventType {

    FIRE_DETECTED,

    MOTION_DETECTED,

    SENSOR_ERROR,

    WIFI_CONNECTED,

    WIFI_DISCONNECTED
};

struct EventData {

    // Type de l'événement
    EventType type;

    // Description de l'événement
    String message;

    // Temps depuis le démarrage
    unsigned long timestampMs = 0;
};