/* ============================================================
   HEALTHGUARDIAN AI - 3D CANVAS & MEDICAL GRAPHICS ENGINE
   Provides WebGL 3D graphics, DNA Helix, Heart Pulse, Particles,
   and dynamic ECG canvas animations.
   ============================================================ */

class MedicalGraphicsEngine {
  constructor() {
    this.particles = [];
    this.ecgOffset = 0;
  }

  // 1. Interactive Medical Particle Background
  initParticleCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 400;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 45;
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 1,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        alpha: Math.random() * 0.5 + 0.2,
        color: i % 3 === 0 ? '#10B981' : (i % 3 === 1 ? '#14B8A6' : '#06B6D4')
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connect near particles with cyan energy grid lines
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[j].x, this.particles[j].y);
            ctx.strokeStyle = `rgba(20, 184, 166, ${0.25 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes
      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    };

    draw();
  }

  // 2. Real-time Live ECG Monitor Canvas
  initECGCanvas(canvasId, bpm = 75) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 180;
    };
    resize();
    window.addEventListener('resize', resize);

    const getECGY = (x) => {
      const cycle = (x + this.ecgOffset) % 220;
      const midY = canvas.height / 2;

      // P wave
      if (cycle > 30 && cycle < 50) {
        return midY - Math.sin((cycle - 30) / 20 * Math.PI) * 12;
      }
      // Q wave
      if (cycle >= 70 && cycle < 78) {
        return midY + 10;
      }
      // R wave (main peak)
      if (cycle >= 78 && cycle < 95) {
        return midY - 65 + Math.abs(cycle - 86.5) * 4;
      }
      // S wave
      if (cycle >= 95 && cycle < 105) {
        return midY + 18;
      }
      // T wave
      if (cycle > 125 && cycle < 160) {
        return midY - Math.sin((cycle - 125) / 35 * Math.PI) * 18;
      }

      // Flatline baseline with micro noise
      return midY + (Math.random() - 0.5) * 2;
    };

    const render = () => {
      ctx.fillStyle = 'rgba(8, 31, 47, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines background
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ECG Glow Waveform line
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#10B981';
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;

      for (let x = 0; x < canvas.width; x += 2) {
        const y = getECGY(x);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      this.ecgOffset += (bpm / 60) * 3.2;
      requestAnimationFrame(render);
    };

    render();
  }

  // 3. 3D DNA Helix Canvas Visualizer
  initDNA3DCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let angle = 0;
    const resize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 350;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 350;
    };
    resize();
    window.addEventListener('resize', resize);

    const renderDNA = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const basePairs = 24;
      const helixRadius = 70;

      for (let i = 0; i < basePairs; i++) {
        const y = (i - basePairs / 2) * 14 + centerY;
        const currentAngle = angle + i * 0.35;

        const x1 = centerX + Math.cos(currentAngle) * helixRadius;
        const z1 = Math.sin(currentAngle) * helixRadius;
        const x2 = centerX - Math.cos(currentAngle) * helixRadius;

        const scale1 = (z1 + 100) / 150;
        const scale2 = (-z1 + 100) / 150;

        // Connecting rung
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 + (z1 + helixRadius) / (2 * helixRadius) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Strand 1 node (Emerald)
        ctx.beginPath();
        ctx.arc(x1, y, Math.max(2, 5 * scale1), 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 8 * scale1;
        ctx.fill();

        // Strand 2 node (Cyan)
        ctx.beginPath();
        ctx.arc(x2, y, Math.max(2, 5 * scale2), 0, Math.PI * 2);
        ctx.fillStyle = '#06B6D4';
        ctx.shadowColor = '#06B6D4';
        ctx.shadowBlur = 8 * scale2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      angle += 0.025;
      requestAnimationFrame(renderDNA);
    };

    renderDNA();
  }

  // 4. Interactive Live Emergency Ambulance Dispatch Map Canvas
  initEmergencyMapCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let progress = 0;
    const resize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 750;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 420;
    };
    resize();
    window.addEventListener('resize', resize);

    // Nodes: Patient location, Hospitals, Ambulances
    const patientPos = { x: 160, y: 310, label: 'Patient Home (Alexander Vance)' };
    const apolloICU = { x: 620, y: 120, label: 'Apollo Critical Care ICU' };
    const cityTrauma = { x: 520, y: 350, label: 'City Emergency Trauma' };

    const waypoints = [
      { x: 620, y: 120 },
      { x: 500, y: 180 },
      { x: 380, y: 220 },
      { x: 260, y: 270 },
      { x: 160, y: 310 }
    ];

    const drawMap = () => {
      ctx.fillStyle = '#06141B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Route Path
      ctx.beginPath();
      ctx.moveTo(waypoints[0].x, waypoints[0].y);
      for (let i = 1; i < waypoints.length; i++) {
        ctx.lineTo(waypoints[i].x, waypoints[i].y);
      }
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Pulsing Route Glow
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([10, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Patient Location Marker
      const time = Date.now() * 0.004;
      const pulseR = 12 + Math.sin(time) * 5;
      ctx.beginPath();
      ctx.arc(patientPos.x, patientPos.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(patientPos.x, patientPos.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.shadowColor = '#EF4444';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillText(patientPos.label, patientPos.x - 60, patientPos.y + 24);

      // Draw Hospitals
      [apolloICU, cityTrauma].forEach(h => {
        ctx.beginPath();
        ctx.arc(h.x, h.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#10B981';
        ctx.shadowColor = '#10B981';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#67E8F9';
        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillText(h.label, h.x - 50, h.y - 18);
      });

      // Animated Moving Ambulance (Unit Alpha-4)
      progress = (progress + 0.002) % 1;
      const totalSegs = waypoints.length - 1;
      const segIndex = Math.min(Math.floor(progress * totalSegs), totalSegs - 1);
      const segT = (progress * totalSegs) - segIndex;

      const p1 = waypoints[segIndex];
      const p2 = waypoints[segIndex + 1];

      const ambX = p1.x + (p2.x - p1.x) * segT;
      const ambY = p1.y + (p2.y - p1.y) * segT;

      ctx.beginPath();
      ctx.arc(ambX, ambY, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ambX, ambY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#06B6D4';
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#06B6D4';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('AMBULANCE ALPHA-4', ambX - 45, ambY - 16);

      requestAnimationFrame(drawMap);
    };

    drawMap();
  }
}

window.medicalGraphics = new MedicalGraphicsEngine();

