#include "TimeManager.h"

unsigned long TimeManager::millisNow() {

    return millis();
}

unsigned long TimeManager::secondsSinceBoot() {

    return millis() / 1000UL;
}