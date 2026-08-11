#pragma once

#include <Arduino.h>

class Logger {

public:

    static void info(
        const String& message
    );

    static void warning(
        const String& message
    );

    static void error(
        const String& message
    );
};