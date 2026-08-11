#include <Arduino.h>

#include "../include/sensors/SensorService.h"
#include "../include/sensors/HeartbeatService.h"
#include "../include/sensors/MonitoringService.h"
#include "../include/network/WiFiManager.h"
#include "../include/network/ApiClient.h"

SensorService sensorService;
MonitoringService monitoringService;
HeartbeatService heartbeatService;
WiFiManager wifiManager;
ApiClient apiClient;


void setup() {
    Serial.begin(115200);

    sensorService.begin();
    wifiManager.begin();
}

void loop() {
    sensorService.readAll();
    monitoringService.update();
    heartbeatService.update();
}