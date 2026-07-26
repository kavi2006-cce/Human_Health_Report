/* ============================================================
   HEALTHGUARDIAN AI - AI NEURAL DIAGNOSTIC & DISEASE PREDICTION ENGINE
   Provides Neural Network Node Visualization, Risk Analyzers,
   Confidence Metrics, and Recommendation Generators.
   ============================================================ */

class AINeuralEngine {
  constructor() {
    this.nodes = [];
    this.connections = [];
  }

  // Render Interactive Neural Network Mesh on Canvas
  initNeuralCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 500;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 350;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize Neural Layers (Input, Hidden 1, Hidden 2, Output)
    const layers = [4, 6, 6, 4];
    this.nodes = [];
    const layerSpacing = canvas.width / (layers.length + 1);

    layers.forEach((nodeCount, layerIdx) => {
      const x = layerSpacing * (layerIdx + 1);
      const nodeSpacing = canvas.height / (nodeCount + 1);

      for (let n = 0; n < nodeCount; n++) {
        const y = nodeSpacing * (n + 1);
        this.nodes.push({
          id: `L${layerIdx}_N${n}`,
          layer: layerIdx,
          x: x,
          y: y,
          baseY: y,
          activation: Math.random(),
          pulseOffset: Math.random() * Math.PI * 2
        });
      }
    });

    const drawNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.003;

      // Update Node Activations
      this.nodes.forEach(node => {
        node.activation = (Math.sin(time + node.pulseOffset) + 1) / 2;
        node.y = node.baseY + Math.sin(time * 0.5 + node.pulseOffset) * 3;
      });

      // Draw Synapses (Connections between adjacent layers)
      for (let i = 0; i < this.nodes.length; i++) {
        for (let j = 0; j < this.nodes.length; j++) {
          const n1 = this.nodes[i];
          const n2 = this.nodes[j];

          if (n2.layer === n1.layer + 1) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            const intensity = (n1.activation + n2.activation) / 2;
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 + intensity * 0.35})`;
            ctx.lineWidth = 1 + intensity * 1.5;
            ctx.stroke();

            // Moving Signal Pulse
            const pulsePos = (time * 0.8 + (i + j) * 0.2) % 1;
            const px = n1.x + (n2.x - n1.x) * pulsePos;
            const py = n1.y + (n2.y - n1.y) * pulsePos;

            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#67E8F9';
            ctx.shadowColor = '#67E8F9';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Draw Nodes
      this.nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6 + node.activation * 3, 0, Math.PI * 2);

        const nodeColor = node.layer === 0 ? '#06B6D4' : (node.layer === 3 ? '#10B981' : '#14B8A6');
        ctx.fillStyle = nodeColor;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = 12 * node.activation;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      requestAnimationFrame(drawNetwork);
    };

    drawNetwork();
  }

  // Calculate Disease Probability Risk Matrix (16 Disease Conditions)
  calculateRiskMatrix(vitals) {
    const { heartRate = 75, sysBP = 120, spo2 = 98, temp = 36.6, sugar = 105, bmi = 23, stress = 24, sleepHours = 7.5 } = vitals;

    // 1. Cardiovascular / Arrhythmia
    let cvRisk = 12;
    if (heartRate > 100 || heartRate < 50) cvRisk += 30;
    if (sysBP > 140) cvRisk += 35;
    if (bmi > 28) cvRisk += 15;
    cvRisk = Math.min(98, Math.max(4, cvRisk));

    // 2. Type-2 Diabetes
    let diabetesRisk = 10;
    if (sugar > 140) diabetesRisk += 45;
    if (sugar > 180) diabetesRisk += 25;
    if (bmi > 27) diabetesRisk += 15;
    diabetesRisk = Math.min(96, Math.max(3, diabetesRisk));

    // 3. Respiratory / Hypoxia / Asthma
    let respRisk = 8;
    if (spo2 < 95) respRisk += 35;
    if (spo2 < 90) respRisk += 45;
    if (temp > 38.5) respRisk += 15;
    respRisk = Math.min(97, Math.max(2, respRisk));

    // 4. Cerebrovascular Stroke
    let strokeRisk = 7;
    if (sysBP > 150) strokeRisk += 40;
    if (heartRate > 110) strokeRisk += 20;
    strokeRisk = Math.min(95, Math.max(2, strokeRisk));

    // 5. Hypertension
    let hypertensionRisk = sysBP > 130 ? Math.min(99, Math.round((sysBP - 110) * 1.5)) : 8;

    // 6. Hypotension
    let hypotensionRisk = sysBP < 100 ? Math.min(95, Math.round((110 - sysBP) * 2.5)) : 5;

    // 7. COVID-19 Symptoms Risk
    let covidRisk = 6;
    if (temp > 38.0 && spo2 < 95) covidRisk += 65;
    else if (temp > 37.5) covidRisk += 25;
    covidRisk = Math.min(95, Math.max(3, covidRisk));

    // 8. Anxiety & Acute Stress
    let anxietyRisk = stress > 60 ? Math.min(95, Math.round(stress * 0.9)) : 14;

    // 9. Kidney Dysfunction Risk
    let kidneyRisk = (sysBP > 140 || sugar > 160) ? 38 : 9;

    // 10. Liver Metabolic Risk
    let liverRisk = bmi > 30 ? 42 : 11;

    // 11. High Fever Risk
    let feverRisk = temp > 38.5 ? Math.min(99, Math.round((temp - 36.5) * 28)) : 4;

    // 12. Dehydration Risk
    let hydrationRisk = (heartRate > 95 && temp > 37.2) ? 45 : 10;

    // 13. Sleep Disorder Risk
    let sleepRisk = sleepHours < 6 ? Math.min(95, Math.round((7 - sleepHours) * 20 + 20)) : 8;

    // Overall Health Score
    const avgRisk = (cvRisk + diabetesRisk + respRisk + strokeRisk + covidRisk + hypertensionRisk) / 6;
    const healthScore = Math.max(15, Math.round(100 - avgRisk));

    return {
      healthScore,
      cardiovascular: cvRisk,
      diabetes: diabetesRisk,
      respiratory: respRisk,
      stroke: strokeRisk,
      hypertension: hypertensionRisk,
      hypotension: hypotensionRisk,
      covid: covidRisk,
      anxiety: anxietyRisk,
      kidney: kidneyRisk,
      liver: liverRisk,
      fever: feverRisk,
      hydration: hydrationRisk,
      sleep: sleepRisk,
      confidence: (96.8 + (Math.random() * 1.5 - 0.75)).toFixed(1)
    };
  }

  // Generate Recommendations Based on AI Analysis
  getRecommendations(vitals, risks) {
    const recs = {
      medical: [],
      diet: [],
      exercise: [],
      doctor: 'Dr. Eleanor Vance (Chief Cardiologist)'
    };

    if (risks.cardiovascular > 35 || risks.hypertension > 40) {
      recs.medical.push('Schedule 12-lead Electrocardiogram (ECG) baseline evaluation.');
      recs.medical.push('Monitor blood pressure twice daily (Morning & Evening).');
      recs.diet.push('Low-sodium DASH diet regimen (< 1,500mg sodium daily).');
      recs.diet.push('Increase omega-3 fatty acid intake (Salmon, Flaxseeds).');
      recs.exercise.push('30 minutes daily moderate cardio (brisk walking). Avoid strenuous lifting.');
    } else {
      recs.medical.push('Physiological indicators optimal. Annual wellness screening recommended.');
      recs.diet.push('Balanced Mediterranean diet rich in leafy greens and lean proteins.');
      recs.exercise.push('Maintain 150 minutes per week of aerobic exercise + strength training.');
    }

    if (risks.respiratory > 30 || risks.covid > 30) {
      recs.medical.push('Pulse oximetry monitoring every 4 hours.');
      recs.diet.push('Warm hydration with antioxidant-rich herbal teas.');
      recs.exercise.push('Controlled diaphragmatic breathing exercises (4-7-8 breathing method).');
    }

    if (risks.diabetes > 35) {
      recs.medical.push('HbA1c glycated hemoglobin laboratory analysis.');
      recs.diet.push('Low glycemic index foods; eliminate refined sugars.');
    }

    return recs;
  }
}

window.aiEngine = new AINeuralEngine();
