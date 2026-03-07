import { useEffect, useRef } from 'react';

export default function StarCanvas({ isDark = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let W, H, animId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Fewer particles for better performance
    const COUNT = window.innerWidth < 768 ? 35 : 60;
    const stars = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.2,
      speed: Math.random() * 0.18 + 0.06,
      o: Math.random() * 0.4 + 0.08,
    }));

    const color = isDark ? '255,255,255' : '79,70,229';
    const alphaMultiplier = isDark ? 1 : 0.35;

    let lastTime = 0;
    const FPS_CAP = 45; // cap at 45fps for smoothness without overkill
    const INTERVAL = 1000 / FPS_CAP;

    function draw(now) {
      animId = requestAnimationFrame(draw);
      const delta = now - lastTime;
      if (delta < INTERVAL) return;
      lastTime = now - (delta % INTERVAL);

      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${s.o * alphaMultiplier})`;
        ctx.fill();
        s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      });
    }
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} id="stars-canvas" />;
}
