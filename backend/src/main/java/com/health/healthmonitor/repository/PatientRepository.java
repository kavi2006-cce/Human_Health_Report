package com.health.healthmonitor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.health.healthmonitor.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
}