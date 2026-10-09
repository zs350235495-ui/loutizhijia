// 跑道上有只鹅 - Canvas 跑道与星空背景
(function() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  // 星空与跑道灯节点
  const stars = [];
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.01 + 0.005
    });
  }

  // 飞行飞机 Blips
  const planes = [
    { x: 50, y: h * 0.25, vx: 1.2, vy: -0.15, label: "Aviation-IPLC" },
    { x: w * 0.6, y: h * 0.4, vx: 0.8, vy: -0.1, label: "SkyWalker-BGP" }
  ];

  function drawRunway() {
    ctx.clearRect(0, 0, w, h);

    // 1. 背景微光
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0c1018');
    grad.addColorStop(1, '#080b12');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. 绘制星空
    stars.forEach(s => {
      s.alpha += s.speed;
      if (s.alpha > 0.8 || s.alpha < 0.2) s.speed *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(251, 191, 36, ${s.alpha})`;
      ctx.fill();
    });

    // 3. 跑道中央中轴线 (Runway Centerline)
    const cx = w / 2;
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. 跑道两侧边灯 (Runway Lights)
    const stepY = 80;
    for (let y = 0; y < h; y += stepY) {
      // 左侧指示灯 (Warm Orange)
      ctx.beginPath();
      ctx.arc(cx - 300, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
      ctx.fill();

      // 右侧指示灯 (Warning Yellow)
      ctx.beginPath();
      ctx.arc(cx + 300, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
      ctx.fill();
    }

    // 5. 飞过夜空的飞机
    planes.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x > w + 50) p.x = -50;
      if (p.y < -20) p.y = h + 20;

      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 15, p.y - p.vy * 15);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px Fira Code, monospace';
      ctx.fillText(`✈ ${p.label}`, p.x + 8, p.y - 4);
    });

    requestAnimationFrame(drawRunway);
  }

  drawRunway();

  window.resetRadarTargets = function() {
    planes.forEach(p => p.x = Math.random() * w);
  };
})();
