"""
HealthGuardian IoT Wearable Sensor Telemetry Simulator
Simulates Apple Watch, Fitbit, Smart Band, Bluetooth ECG/SpO2 Sensors broadcasting real-time physiological metrics.
"""

import time
import random
import json
import math

class WearableSensorSimulator:
    def __init__(self, device_name="Apple Watch Series 9", patient_id="HG-88412"):
        self.device_name = device_name
        self.patient_id = patient_id
        self.base_hr = 75
        self.base_spo2 = 98
        self.base_temp = 36.6

    def generate_telemetry_packet(self):
        # Generate bio-noise and periodic pulse fluctuations
        t = time.time()
        hr_variation = int(math.sin(t * 0.2) * 5 + random.randint(-2, 3))
        spo2_variation = random.choice([0, 0, 0, -1, 0])
        temp_variation = round(random.uniform(-0.1, 0.1), 1)

        packet = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "deviceId": self.device_name,
            "patientId": self.patient_id,
            "vitals": {
                "heartRate": max(45, min(180, self.base_hr + hr_variation)),
                "spO2": max(85, min(100, self.base_spo2 + spo2_variation)),
                "temperature": round(self.base_temp + temp_variation, 1),
                "bloodPressure": f"{120 + random.randint(-4, 6)}/{80 + random.randint(-3, 4)}",
                "respirationRate": 16 + random.randint(-1, 2)
            },
            "status": "STREAMING_ACTIVE"
        }
        return packet

    def run_stream(self, interval_seconds=2, max_packets=5):
        print(f"[IoT Simulator] Initializing telemetry stream for {self.device_name}...")
        for i in range(max_packets):
            data = self.generate_telemetry_packet()
            print(f"[Packet #{i+1}] Broadcast -> HR: {data['vitals']['heartRate']} BPM | SpO2: {data['vitals']['spO2']}% | Temp: {data['vitals']['temperature']}°C")
            time.sleep(interval_seconds)

if __name__ == "__main__":
    sim = WearableSensorSimulator()
    sim.run_stream(interval_seconds=1, max_packets=3)
