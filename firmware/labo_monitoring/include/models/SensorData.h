#pragma once

#include <Arduino.h>

struct SensorData {

    // Mesures environnementales
    float temperature = NAN;
    float humidity = NAN;
    float coRaw = NAN;
    float luminosity = NAN;

    // Détections
    bool motionDetected = false;
    bool fireDetected = false;

    // Temps depuis le démarrage de l'ESP32
    unsigned long uptimeMs = 0;
};