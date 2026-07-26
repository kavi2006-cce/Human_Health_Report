package com.health.healthmonitor.controller;

import com.health.healthmonitor.model.EmergencyAlert;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final List<EmergencyAlert> activeAlerts = new ArrayList<>();

    public EmergencyController() {
        activeAlerts.add(new EmergencyAlert("Alexander Vance", 138, 91, "165/105", "HIGH CRITICAL", "DISPATCHED", "Unit Alpha-4", 3));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<EmergencyAlert>> getActiveAlerts() {
        return ResponseEntity.ok(activeAlerts);
    }

    @PostMapping("/trigger")
    public ResponseEntity<EmergencyAlert> triggerEmergency(@RequestBody EmergencyAlert alert) {
        alert.setStatus("DISPATCHED");
        alert.setAmbulanceUnit("Unit Alpha-4");
        alert.setEtaMinutes(3);
        activeAlerts.add(alert);
        return ResponseEntity.ok(alert);
    }

    @PostMapping("/cancel/{id}")
    public ResponseEntity<String> cancelEmergency(@PathVariable Long id) {
        activeAlerts.removeIf(a -> a.getId() != null && a.getId().equals(id));
        return ResponseEntity.ok("Emergency dispatch cancelled.");
    }
}
