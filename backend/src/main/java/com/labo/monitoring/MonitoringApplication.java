package com.labo.monitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.labo.monitoring.config.DeviceProperties;
import com.labo.monitoring.config.MqttProperties;

@SpringBootApplication
@EnableConfigurationProperties({
		DeviceProperties.class,
		MqttProperties.class
})
public class MonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(MonitoringApplication.class, args);
	}

}
