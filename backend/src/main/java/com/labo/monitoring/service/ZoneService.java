package com.labo.monitoring.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.labo.monitoring.model.Device;
import com.labo.monitoring.model.Product;
import com.labo.monitoring.repository.DeviceRepository;
import com.labo.monitoring.repository.ProductRepository;
import com.labo.monitoring.repository.ThresholdRepository;

@Service
public class ZoneService {

  private final DeviceRepository deviceRepository;
  private final ProductRepository productRepository;
  private final ThresholdRepository thresholdRepository;

  public ZoneService(DeviceRepository deviceRepository, ProductRepository productRepository,
      ThresholdRepository thresholdRepository) {
    this.deviceRepository = deviceRepository;
    this.productRepository = productRepository;
    this.thresholdRepository = thresholdRepository;
  }

  public List<Device> getDevicesByZone(String zoneId) {
    return deviceRepository.findByZoneId(zoneId);
  }

  public List<Product> getProductsByZone(String zoneId) {
    return productRepository.findByZoneId(zoneId);
  }
}
