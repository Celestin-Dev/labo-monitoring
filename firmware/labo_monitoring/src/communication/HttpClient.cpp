#include "../include/com/HttpClient.h"

#include <WiFi.h>
#include <HTTPClient.h>

#include "../../include/config/AppConfig.h"

bool HttpClient::postJson(
    const String& url,
    const String& json,
    int& statusCode
) {

    if (
        WiFi.status()
        != WL_CONNECTED
    ) {

        statusCode = -1;

        return false;
    }

    HTTPClient http;

    http.setTimeout(
        MEASUREMENT_INTERVAL
    );

    if (!http.begin(url)) {

        statusCode = -2;

        return false;
    }

    http.addHeader(
        "Content-Type",
        "application/json"
    );

    statusCode =
        http.POST(json);

    bool success =
        statusCode >= 200 &&
        statusCode < 300;

    if (!success) {

        Serial.printf(
            "[HTTP] Error: %d\n",
            statusCode
        );
    }

    http.end();

    return success;
}