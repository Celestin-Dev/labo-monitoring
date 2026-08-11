#pragma once

#include <Arduino.h>

class TimeManager {

public:

    static unsigned long millisNow();

    static unsigned long secondsSinceBoot();
};