package com.health.healthmonitor.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class EmergencyAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;
    private int heartRate;
    private int spo2;
    private String bloodPressure;
    private String severity;
    private String status; // TRIGGERED, DISPATCHED, ADMITTED, CANCELLED
    private String ambulanceUnit;
    private int etaMinutes;
    private LocalDateTime timestamp;

    public EmergencyAlert() {
        this.timestamp = LocalDateTime.now();
    }

    public EmergencyAlert(String patientName, int heartRate, int spo2, String bloodPressure, String severity, String status, String ambulanceUnit, int etaMinutes) {
        this.patientName = patientName;
        this.heartRate = heartRate;
        this.spo2 = spo2;
        this.bloodPressure = bloodPressure;
        this.severity = severity;
        this.status = status;
        this.ambulanceUnit = ambulanceUnit;
        this.etaMinutes = etaMinutes;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public int getHeartRate() { return heartRate; }
    public void setHeartRate(int heartRate) { this.heartRate = heartRate; }

    public int getSpo2() { return spo2; }
    public void setSpo2(int spo2) { this.spo2 = spo2; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAmbulanceUnit() { return ambulanceUnit; }
    public void setAmbulanceUnit(String ambulanceUnit) { this.ambulanceUnit = ambulanceUnit; }

    public int getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(int etaMinutes) { this.etaMinutes = etaMinutes; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
