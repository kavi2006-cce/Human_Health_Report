package com.health.healthmonitor.controller;

import com.health.healthmonitor.model.Hospital;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final List<Hospital> hospitals = new ArrayList<>();

    public HospitalController() {
        hospitals.add(new Hospital("Apollo Critical Care ICU", "104 Healthcare Blvd", 12, 15, 28, 4, "+1-800-APOLLO-ICU", 37.7749, -122.4194));
        hospitals.add(new Hospital("City Emergency Trauma Center", "45 Metro Center Way", 8, 10, 15, 2, "+1-800-CITY-EMERGENCY", 37.7833, -122.4167));
    }

    @GetMapping
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return ResponseEntity.ok(hospitals);
    }

    @PostMapping("/{id}/reserve-bed")
    public ResponseEntity<Hospital> reserveIcuBed(@PathVariable Long id) {
        for (Hospital h : hospitals) {
            if (h.getId() != null && h.getId().equals(id)) {
                if (h.getAvailableIcuBeds() > 0) {
                    h.setAvailableIcuBeds(h.getAvailableIcuBeds() - 1);
                }
                return ResponseEntity.ok(h);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
