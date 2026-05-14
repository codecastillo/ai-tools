'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const PARTICLE_COUNT = 36;
const MAX_DIST = 140;
const FALLBACK_COLOR = '#FF6B5B';

function parseAccent(raw: string): { r: number; g: number; b: number } {
  const value = raw.trim() || FALLBACK_COLOR;

  // Hex (#rgb or #rrggbb)
  if (value.startsWith('#')) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  // rgb() or rgba()
  const rgbMatch = value.match(
    /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i,
  );
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }

  // Fallback
  return { r: 255, g: 107, b: 91 };
}

function makeParticles(width: number, height: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 2,
    });
  }
  return particles;
}

export default function HeroIllustrationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const accentRaw = getComputedStyle(canvas)
      .getPropertyValue('--color-accent');
    const accent = parseAccent(accentRaw);
    const accentRgb = `${accent.r}, ${accent.g}, ${accent.b}`;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let width = container.clientWidth;
    let height = container.clientHeight;
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let particles = makeParticles(width, height);
    let rafId = 0;

    const resizeCanvas = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep particle positions in bounds after resize
      for (const p of particles) {
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Lines between near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const t = 1 - dist / MAX_DIST;
            const alpha = 0.05 + t * 0.15;
            ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = `rgb(${accentRgb})`;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap edges
        if (p.x < -p.r) p.x = width + p.r;
        else if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        else if (p.y > height + p.r) p.y = -p.r;
      }
      draw();
      rafId = requestAnimationFrame(step);
    };

    resizeCanvas();

    const ro = new ResizeObserver(() => {
      resizeCanvas();
      // Redraw immediately on resize (covers reduced-motion case too)
      draw();
    });
    ro.observe(container);

    if (reducedMotion) {
      draw();
    } else {
      rafId = requestAnimationFrame(step);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[260px] md:h-[320px] opacity-70 pointer-events-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
