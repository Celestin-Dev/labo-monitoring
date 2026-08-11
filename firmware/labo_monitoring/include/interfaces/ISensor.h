// include/interfaces/ISensor.h

#ifndef I_SENSOR_H
#define I_SENSOR_H

class ISensor {
public:
    virtual ~ISensor() = default;

    virtual bool begin() = 0;
    virtual bool update() = 0;
    virtual float read() = 0;
};

#endif