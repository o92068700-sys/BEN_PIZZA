// Lightweight, high-performance canvas confetti for mobile & desktop (60fps)
export function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const w = (canvas.width = window.innerWidth * dpr);
  const h = (canvas.height = window.innerHeight * dpr);
  ctx.scale(dpr, dpr);

  const colors = ["#d94b3d", "#b77845", "#e0b387", "#79815c", "#f7f0e5", "#ffd166", "#06d6a0"];
  const count = 75;
  const particles = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI - Math.PI / 2;
    const speed = 12 + Math.random() * 18;
    return {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.8,
      vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 6,
      vy: Math.sin(angle) * speed - 10,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 12,
      opacity: 1,
      gravity: 0.55,
      drag: 0.96,
    };
  });

  const start = performance.now();
  const duration = 2400;

  function frame(now: number) {
    const elapsed = now - start;
    if (elapsed > duration) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.rotation += p.vRotation;
      p.opacity = Math.max(0, 1 - elapsed / duration);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
