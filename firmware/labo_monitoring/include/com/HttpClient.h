#pragma once

#include <Arduino.h>

class HttpClient {

public:

    bool postJson(
        const String& url,
        const String& json,
        int& statusCode
    );
};