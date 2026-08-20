package com.labo.monitoring.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.labo.monitoring.dto.request.ThresholdRequest;
import com.labo.monitoring.exception.ResourceNotFoundException;
import com.labo.monitoring.model.Threshold;
import com.labo.monitoring.repository.ThresholdRepository;

@Service
public class ThresholdService {

  @Autowired
  private ThresholdRepository thresholdRepository;

  public List<Threshold> findAll() {
    return thresholdRepository.findAll();
  }

  public Threshold findById(String id) {
    return thresholdRepository.findById(id)
        .orElseThrow(() -> ResourceNotFoundException.of("Règle de seuil", id));
  }

  public Optional<Threshold> findByZone(String zoneId) {
    return thresholdRepository.findByZoneId(zoneId);
  }

  public Threshold create(ThresholdRequest request) {
    Threshold threshold = mapToEntity(new Threshold(), request);
    return thresholdRepository.save(threshold);
  }

  public Threshold update(String id, ThresholdRequest request) {
    Threshold threshold = findById(id);
    return thresholdRepository.save(mapToEntity(threshold, request));
  }

  public void delete(String id) {
    if (!thresholdRepository.existsById(id)) {
      throw ResourceNotFoundException.of("Règle de seuil", id);
    }
    thresholdRepository.deleteById(id);
  }

  private Threshold mapToEntity(Threshold threshold, ThresholdRequest request) {
    threshold.setZoneId(request.getZoneId());
    threshold.setMinTemperature(request.getMinTemperature());
    threshold.setMaxTemperature(request.getMaxTemperature());
    threshold.setMinHumidity(request.getMinHumidity());
    threshold.setMaxHumidity(request.getMaxHumidity());
    threshold.setCoMax(request.getCoMax());
    threshold.setLuminosityMax(request.getLuminosityMax());
    threshold.setEnabled(request.isEnabled());
    return threshold;
  }
}
