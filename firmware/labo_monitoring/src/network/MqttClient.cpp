#include "../../include/network/MqttClient.h"

#include <ArduinoJson.h>

MqttClient::MqttClient()
    : mqttClient(wifiClient)
{
}

void MqttClient::begin(const DeviceConfig &deviceConfig)
{
    config = deviceConfig;

    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);

    Serial.println("[MQTT] Client initialized");
    Serial.print("[MQTT] Broker: ");
    Serial.print(MQTT_BROKER);
    Serial.print(":");
    Serial.println(MQTT_PORT);
}

void MqttClient::update()
{
    if (!WiFi.isConnected())
    {
        return;
    }

    if (!mqttClient.connected())
    {

        unsigned long now = millis();

        if (now - lastReconnectAttempt >= 5000)
        {
            lastReconnectAttempt = now;
            connect();
        }

        return;
    }

    mqttClient.loop();
}

bool MqttClient::connect()
{
    if (mqttClient.connected())
    {
        return true;
    }

    String clientId = config.deviceId;

    Serial.print("[MQTT] Connecting as ");
    Serial.println(clientId);
    bool result = mqttClient.connect(clientId.c_str());

    if (result)
    {
        Serial.println("[MQTT] Connected successfully");
    }
    else
    {
        Serial.print("[MQTT] Connection failed: ");
        Serial.println(mqttClient.state());
    }

    return result;
}

bool MqttClient::isConnected()
{
    return mqttClient.connected();
}

String MqttClient::buildMeasurementJson(const SensorData &data)
{
    JsonDocument doc;

    doc["temperature"] = data.temperature;

    doc["humidity"] = data.humidity;

    doc["coRaw"] = data.coRaw;

    doc["luminosity"] = data.luminosity;

    doc["motionDetected"] = data.motionDetected;

    doc["fireDetected"] = data.fireDetected;

    doc["timestamp"] = millis();

    String json;

    serializeJson(doc, json);

    return json;
}

bool MqttClient::publishMeasurement(const DeviceInfo &device, const SensorData &data)
{
    if (
        !mqttClient.connected())
    {

        return false;
    }

    String topic =
        "lab/" +
        device.zoneId +
        "/" +
        device.deviceId +
        "/measurements";

    String json =
        buildMeasurementJson(
            data);

    Serial.println();
    Serial.println("[MQTT] Publishing measurement");
    Serial.print("[MQTT] Topic: ");
    Serial.println(topic);
    Serial.print("[MQTT] Payload: ");
    Serial.println(json);

    return mqttClient.publish(topic.c_str(), json.c_str());
}