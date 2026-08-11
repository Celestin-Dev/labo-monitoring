#include <Arduino.h>

#include "../include/sensors/SensorService.h"
#include "../include/services/MonitoringService.h"
#include "../include/services/HeartbeatService.h"

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