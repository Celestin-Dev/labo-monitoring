#include <Arduino.h>

void setup() {
    Serial.begin(115200);

    sensorService.begin();
    wifiManager.begin();
    apiClient.begin();
}

void loop() {
    sensorService.update();
    monitoringService.update();
    heartbeatService.update();
}