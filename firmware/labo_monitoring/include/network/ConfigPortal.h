#pragma once

#include <Arduino.h>
#include <WebServer.h>
#include <DNSServer.h>

#include "../models/DeviceConfig.h"
#include "../storage/ConfigStorage.h"

class ConfigPortal {

public:

    ConfigPortal(
        ConfigStorage* storage
    );

    void begin();

    void update();

    void stop();

    bool isRunning();

private:

    WebServer server;

    DNSServer dnsServer;

    ConfigStorage* storage;

    bool running = false;

    void handleRoot();

    void handleSave();

    void handleNotFound();

    String htmlPage();

    String htmlSuccess();
};