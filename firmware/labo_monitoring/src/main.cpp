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

    if(sensorService.begin()) {
        Serial.println("SensorService initialized successfully.");
    } else {
        Serial.println("SensorService initialization failed.");
    }
    wifiManager.begin();
}

void loop() {
    monitoringService.update();
    heartbeatService.update();
    monitoringService.printData(sensorService.readAll());
    delay(1000);
} 