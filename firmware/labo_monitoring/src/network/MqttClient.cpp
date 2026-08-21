#include "../../include/network/MqttClient.h"

#include "../../include/config/MqttConfig.h"

#include <ArduinoJson.h>
#include <WiFi.h>


MqttClient::MqttClient()
    : mqttClient(wifiClient)
{
}


void MqttClient::begin()
{
    mqttClient.setServer(
        MQTT_BROKER,
        MQTT_PORT
    );

    Serial.println(
        "[MQTT] Client initialized"
    );
}


void MqttClient::update()
{
    if (!WiFi.isConnected()) {
        return;
    }

    if (!mqttClient.connected()) {

        unsigned long now = millis();

        if (
            now - lastReconnectAttempt
            >= MQTT_RECONNECT_INTERVAL
        ) {

            lastReconnectAttempt = now;

            connect();
        }

        return;
    }

    mqttClient.loop();
}


bool MqttClient::connect()
{
    if (mqttClient.connected()) {
        return true;
    }

    Serial.print(
        "[MQTT] Connecting to broker: "
    );

    Serial.print(MQTT_BROKER);
    Serial.print(":");
    Serial.println(MQTT_PORT);


    bool connected;


    if (strlen(MQTT_USERNAME) > 0) {

        connected = mqttClient.connect(
            MQTT_CLIENT_ID,
            MQTT_USERNAME,
            MQTT_PASSWORD
        );

    } else {

        connected = mqttClient.connect(
            MQTT_CLIENT_ID
        );
    }


    if (connected) {

        Serial.println(
            "[MQTT] Connected successfully"
        );

        return true;
    }


    Serial.print(
        "[MQTT] Connection failed. State = "
    );

    Serial.println(
        mqttClient.state()
    );

    return false;
}


bool MqttClient::isConnected()
{
    return mqttClient.connected();
}


String MqttClient::buildMeasurementJson(
    const SensorData& data
)
{
    JsonDocument doc;


    if (!isnan(data.temperature)) {

        doc["temperature"] =
            data.temperature;
    }


    if (!isnan(data.humidity)) {

        doc["humidity"] =
            data.humidity;
    }


    if (!isnan(data.coRaw)) {

        doc["coRaw"] =
            data.coRaw;
    }


    if (!isnan(data.luminosity)) {

        doc["luminosity"] =
            data.luminosity;
    }


    doc["motionDetected"] =
        data.motionDetected;


    doc["fireDetected"] =
        data.fireDetected;


    /*
     * Pour l'instant timestamp utilise
     * millis().
     *
     * Il faudra ensuite remplacer cette
     * valeur par un timestamp Unix NTP.
     */
    doc["timestamp"] =
        millis();


    String json;

    serializeJson(
        doc,
        json
    );

    return json;
}


bool MqttClient::publishMeasurement(
    const DeviceInfo& device,
    const SensorData& data
)
{
    if (!mqttClient.connected()) {

        Serial.println(
            "[MQTT] Not connected"
        );

        return false;
    }


    /*
     * Topic :
     *
     * lab/{zoneId}/{deviceId}/measurements
     */

    String topic =
        "lab/" +
        device.zoneId +
        "/" +
        device.deviceId +
        "/measurements";


    String json =
        buildMeasurementJson(data);


    Serial.println();
    Serial.println(
        "[MQTT] Publishing measurement"
    );

    Serial.print(
        "[MQTT] Topic: "
    );

    Serial.println(topic);

    Serial.print(
        "[MQTT] Payload: "
    );

    Serial.println(json);


    bool result =
        mqttClient.publish(
            topic.c_str(),
            json.c_str()
        );


    if (result) {

        Serial.println(
            "[MQTT] Published successfully"
        );

    } else {

        Serial.println(
            "[MQTT] Publish failed"
        );
    }


    return result;
}