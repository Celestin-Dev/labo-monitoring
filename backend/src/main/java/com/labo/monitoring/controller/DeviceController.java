package com.labo.monitoring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.labo.monitoring.dto.request.DeviceRequest;
import com.labo.monitoring.model.Device;
import com.labo.monitoring.service.DeviceService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

  @Autowired
  private DeviceService deviceService;

  @GetMapping
  public List<Device> getAll(@RequestParam(required = false) String zoneId) {
    return zoneId != null ? deviceService.findByZone(zoneId) : deviceService.findAll();
  }

  @GetMapping("/{id}")
  public Device getById(@PathVariable String id) {
    return deviceService.findById(id);
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public Device create(@Valid @RequestBody DeviceRequest request) {
    return deviceService.create(request);
  }

  @PutMapping("/{id}")
  public Device update(@PathVariable String id, @Valid @RequestBody DeviceRequest request) {
    return deviceService.update(id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable String id) {
    deviceService.delete(id);
  }
}
