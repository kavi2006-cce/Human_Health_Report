package com.health.healthmonitor.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.health.healthmonitor.model.Patient;
import com.health.healthmonitor.repository.PatientRepository;

@CrossOrigin(origins = "*")
@RestController
public class PatientController {

    @Autowired
    private PatientRepository repo;

    @GetMapping("/")
    public String home() {
        return "Health Monitoring System Backend Running";
    }

    @PostMapping("/add")
    public Patient addPatient(@RequestBody Patient p) {
        if (p.getHeartRate() > 100 || p.getTemperature() > 38 || p.getSpo2() < 95) {
            p.setStatus("Risk");
        } else {
            p.setStatus("Normal");
        }

        return repo.save(p);
    }

    @GetMapping("/patients")
    public List<Patient> getAllPatients() {
        return repo.findAll();
    }
}