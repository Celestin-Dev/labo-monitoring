#include "../../include/sensors/LightSensor.h"

// Exemple : LDR connectée sur GPIO 34 de l'ESP32
#define LDR_PIN 34

bool LightSensor::begin() {
    pin = LDR_PIN;

    pinMode(pin, INPUT);

    // Configuration ADC ESP32
    analogReadResolution(12); // 0 à 4095

    return true;
}

bool LightSensor::update() {
    int rawValue = analogRead(pin);

    // Conversion approximative en pourcentage de luminosité
    luminosity = (rawValue / 4095.0f) * 100.0f;

    return true;
}

float LightSensor::read() {
    return luminosity;
}