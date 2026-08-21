#include <Arduino.h>

#include "../include/sensors/SensorService.h"
#include "../include/network/WiFiManager.h"
#include "../include/network/MqttClient.h"
#include "../include/models/DeviceInfo.h"
#include "../include/sensors/MonitoringService.h"

SensorService sensorService;
MonitoringService monitoringService;
WiFiManager wifiManager;
MqttClient mqttClient;
DeviceInfo deviceInfo;


void setup()
{
    Serial.begin(115200);

    Serial.println();
    Serial.println("==============================");
    Serial.println(" Laboratory Monitoring ESP32 ");
    Serial.println("==============================");

    // Capteurs
    if (sensorService.begin()) {

        Serial.println(
            "[SENSOR] Initialized successfully"
        );

    } else {

        Serial.println(
            "[SENSOR] Initialization failed"
        );
    }

    // WiFi
    wifiManager.begin();

    // MQTT
    mqttClient.begin();

    // Tentative de connexion MQTT
    mqttClient.connect();

    //Monitoring
    monitoringService.begin(
        &sensorService,
        &mqttClient,
        &deviceInfo
    );

}

void loop()
{

    wifiManager.update();

    mqttClient.update();

    monitoringService.update();

    delay(100);
}