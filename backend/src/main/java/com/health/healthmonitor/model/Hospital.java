package com.health.healthmonitor.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private int availableIcuBeds;
    private int totalIcuBeds;
    private int availableEmergencyBeds;
    private int availableAmbulances;
    private String contactNumber;
    private double latitude;
    private double longitude;

    public Hospital() {}

    public Hospital(String name, String address, int availableIcuBeds, int totalIcuBeds, int availableEmergencyBeds, int availableAmbulances, String contactNumber, double latitude, double longitude) {
        this.name = name;
        this.address = address;
        this.availableIcuBeds = availableIcuBeds;
        this.totalIcuBeds = totalIcuBeds;
        this.availableEmergencyBeds = availableEmergencyBeds;
        this.availableAmbulances = availableAmbulances;
        this.contactNumber = contactNumber;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public int getAvailableIcuBeds() { return availableIcuBeds; }
    public void setAvailableIcuBeds(int availableIcuBeds) { this.availableIcuBeds = availableIcuBeds; }

    public int getTotalIcuBeds() { return totalIcuBeds; }
    public void setTotalIcuBeds(int totalIcuBeds) { this.totalIcuBeds = totalIcuBeds; }

    public int getAvailableEmergencyBeds() { return availableEmergencyBeds; }
    public void setAvailableEmergencyBeds(int availableEmergencyBeds) { this.availableEmergencyBeds = availableEmergencyBeds; }

    public int getAvailableAmbulances() { return availableAmbulances; }
    public void setAvailableAmbulances(int availableAmbulances) { this.availableAmbulances = availableAmbulances; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}
