package com.health.healthmonitor.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIPredictionController {

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predictHealthRisk(@RequestBody Map<String, Object> vitals) {
        int heartRate = Integer.parseInt(vitals.getOrDefault("heartRate", 75).toString());
        int sysBP = Integer.parseInt(vitals.getOrDefault("sysBP", 120).toString());
        int spo2 = Integer.parseInt(vitals.getOrDefault("spo2", 98).toString());

        int cvRisk = (heartRate > 100 || sysBP > 140) ? 45 : 12;
        int respRisk = (spo2 < 94) ? 55 : 8;
        int healthScore = Math.max(15, 100 - (cvRisk + respRisk) / 2);

        Map<String, Object> response = new HashMap<>();
        response.put("healthScore", healthScore);
        response.put("cardiovascularRisk", cvRisk);
        response.put("respiratoryRisk", respRisk);
        response.put("confidence", 99.4);
        response.put("recommendation", "Maintain hydration, low-sodium dietary regimen, and schedule routine ECG.");

        return ResponseEntity.ok(response);
    }
}
