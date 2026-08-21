#include "../../include/network/ConfigPortal.h"

#include <WiFi.h>


ConfigPortal::ConfigPortal(
    ConfigStorage* storage
)
    : server(80),
      storage(storage)
{
}


void ConfigPortal::begin()
{
    Serial.println();
    Serial.println(
        "================================"
    );

    Serial.println(
        "[CONFIG] Starting configuration AP"
    );

    Serial.println(
        "================================"
    );


    /*
     * AP IP :
     *
     * 192.168.4.1
     */

    IPAddress apIP(
        192, 168, 4, 1
    );

    IPAddress gateway(
        192, 168, 4, 1
    );

    IPAddress subnet(
        255, 255, 255, 0
    );


    WiFi.mode(WIFI_AP);

    WiFi.softAPConfig(
        apIP,
        gateway,
        subnet
    );


    const char* AP_SSID =
        "LAB-MONITOR-SETUP";

    const char* AP_PASSWORD =
        "labmonitor123";


    bool result =
        WiFi.softAP(
            AP_SSID,
            AP_PASSWORD
        );


    if (!result) {

        Serial.println(
            "[CONFIG] AP start failed"
        );

        return;
    }


    Serial.println(
        "[CONFIG] AP started"
    );

    Serial.print(
        "[CONFIG] SSID: "
    );

    Serial.println(AP_SSID);

    Serial.print(
        "[CONFIG] IP: "
    );

    Serial.println(
        WiFi.softAPIP()
    );


    /*
     * DNS captive portal
     */

    dnsServer.start(
        53,
        "*",
        apIP
    );


    /*
     * Routes HTTP
     */

    server.on(
        "/",
        HTTP_GET,
        [this]() {
            handleRoot();
        }
    );


    server.on(
        "/save",
        HTTP_POST,
        [this]() {
            handleSave();
        }
    );


    server.onNotFound(
        [this]() {
            handleNotFound();
        }
    );


    server.begin();

    running = true;


    Serial.println(
        "[CONFIG] Web server started"
    );
}


void ConfigPortal::update()
{
    if (!running) {
        return;
    }

    dnsServer.processNextRequest();

    server.handleClient();
}


void ConfigPortal::stop()
{
    if (!running) {
        return;
    }

    server.stop();

    dnsServer.stop();

    WiFi.softAPdisconnect(true);

    running = false;

    Serial.println(
        "[CONFIG] Portal stopped"
    );
}


bool ConfigPortal::isRunning()
{
    return running;
}


void ConfigPortal::handleRoot()
{
    server.send(
        200,
        "text/html",
        htmlPage()
    );
}


void ConfigPortal::handleSave()
{
    DeviceConfig config;


    config.deviceId =
        server.arg("deviceId");

    config.zoneId =
        server.arg("zoneId");

    config.wifiSsid =
        server.arg("wifiSsid");

    config.wifiPassword =
        server.arg("wifiPassword");

    config.mqttBroker =
        server.arg("mqttBroker");


    String mqttPort =
        server.arg("mqttPort");


    config.mqttPort =
        mqttPort.toInt();


    /*
     * Validation
     */

    if (
        config.deviceId.isEmpty() ||
        config.zoneId.isEmpty() ||
        config.wifiSsid.isEmpty() ||
        config.mqttBroker.isEmpty()
    ) {

        server.send(
            400,
            "text/html",
            "<h2>Erreur</h2>"
            "<p>Veuillez remplir tous les champs obligatoires.</p>"
        );

        return;
    }


    if (config.mqttPort == 0) {

        config.mqttPort = 1883;
    }


    /*
     * Sauvegarde NVS
     */

    bool saved =
        storage->save(config);


    if (!saved) {

        server.send(
            500,
            "text/html",
            "<h2>Erreur</h2>"
            "<p>Impossible de sauvegarder la configuration.</p>"
        );

        return;
    }


    Serial.println();
    Serial.println(
        "[CONFIG] Configuration saved"
    );

    Serial.print(
        "[CONFIG] Device ID: "
    );

    Serial.println(
        config.deviceId
    );

    Serial.print(
        "[CONFIG] Zone ID: "
    );

    Serial.println(
        config.zoneId
    );

    Serial.print(
        "[CONFIG] WiFi SSID: "
    );

    Serial.println(
        config.wifiSsid
    );

    Serial.print(
        "[CONFIG] MQTT Broker: "
    );

    Serial.println(
        config.mqttBroker
    );


    server.send(
        200,
        "text/html",
        htmlSuccess()
    );


    delay(1500);

    ESP.restart();
}


void ConfigPortal::handleNotFound()
{
    /*
     * Toutes les URL sont redirigées
     * vers la page de configuration.
     */

    server.sendHeader(
        "Location",
        "/",
        true
    );

    server.send(
        302,
        "text/plain",
        ""
    );
}


// Page web
String ConfigPortal::htmlPage()
{
    String html = R"rawliteral(
<!DOCTYPE html>
<html lang="fr">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width,
               initial-scale=1.0">

<title>Laboratory Monitoring</title>

<style>

body {
    font-family: Arial, sans-serif;
    background: #f4f6f8;
    margin: 0;
    padding: 20px;
}

.container {
    max-width: 600px;
    margin: auto;
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

h1 {
    color: #1565C0;
    text-align: center;
}

h2 {
    font-size: 18px;
    margin-top: 25px;
}

label {
    display: block;
    margin-top: 15px;
    font-weight: bold;
}

input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    margin-top: 6px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

button {
    width: 100%;
    margin-top: 25px;
    padding: 14px;
    border: none;
    border-radius: 6px;
    background: #1565C0;
    color: white;
    font-size: 16px;
    cursor: pointer;
}

button:hover {
    background: #0D47A1;
}

.info {
    background: #e3f2fd;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
}

</style>

</head>


<body>

<div class="container">

<h1>
Laboratory Monitoring
</h1>

<div class="info">

Configurez cet ESP32 avant son
installation dans le laboratoire.

</div>


<form method="POST"
      action="/save">


<h2>
Identification
</h2>


<label>
Device ID
</label>

<input
    type="text"
    name="deviceId"
    placeholder="esp32-d1"
    required
>


<label>
Zone ID
</label>

<input
    type="text"
    name="zoneId"
    placeholder="zoneD"
    required
>


<h2>
WiFi de la salle
</h2>


<label>
SSID WiFi
</label>

<input
    type="text"
    name="wifiSsid"
    placeholder="LAB-WIFI"
    required
>


<label>
Mot de passe WiFi
</label>

<input
    type="password"
    name="wifiPassword"
    required
>


<h2>
MQTT
</h2>


<label>
Adresse du broker MQTT
</label>

<input
    type="text"
    name="mqttBroker"
    placeholder="192.168.1.100"
    required
>


<label>
Port MQTT
</label>

<input
    type="number"
    name="mqttPort"
    value="1883"
    required
>


<button type="submit">

Enregistrer et redémarrer

</button>


</form>

</div>

</body>

</html>
)rawliteral";

    return html;
}


String ConfigPortal::htmlSuccess()
{
    return R"rawliteral(

<!DOCTYPE html>

<html lang="fr">

<head>

<meta charset="UTF-8">

<meta name="viewport"
      content="width=device-width,
               initial-scale=1.0">

<title>Configuration</title>

</head>

<body>

<h1>
Configuration enregistrée
</h1>

<p>
L'ESP32 va redémarrer automatiquement.
</p>

<p>
Après le redémarrage, il se connectera
au WiFi configuré.
</p>

</body>

</html>

)rawliteral";
}