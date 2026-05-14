'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

// Densities are tuned for a fullscreen canvas: enough particles to feel rich
// without breaking the 60fps budget on a mid-range laptop. We adapt the count
// to the viewport area so giant 4K screens still feel populated and tiny
// phones don't burn battery on overdraw.
function pickParticleCount(width: number, height: number): number {
  const area = width * height;
  const base = Math.round(area / 24_000);
  return Math.max(40, Math.min(120, base));
}

const MAX_DIST = 160;
const FALLBACK_COLOR = '#FF6B5B';

function parseAccent(raw: string): { r: number; g: number; b: number } {
  const value = raw.trim() || FALLBACK_COLOR;
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
  const rgbMatch = value.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
    };
  }
  return { r: 255, g: 107, b: 91 };
}

function makeParticles(width: number, height: number, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 0.8 + Math.random() * 1.6,
    });
  }
  return particles;
}

/**
 * Fullscreen ambient particle field. Renders behind all page content via a
 * fixed-position canvas. Theme-aware colour, density-aware count, motion-
 * preference aware (static frame for reduced motion).
 */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let particles = makeParticles(width, height, pickParticleCount(width, height));
    let rafId = 0;
    let accentRgb = '255, 107, 91';

    const refreshAccent = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--color-accent');
      const c = parseAccent(raw);
      accentRgb = `${c.r}, ${c.g}, ${c.b}`;
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Re-derive count for the new viewport, preserving in-bounds particles.
      const next = pickParticleCount(width, height);
      if (next > particles.length) {
        particles = particles.concat(
          makeParticles(width, height, next - particles.length),
        );
      } else if (next < particles.length) {
        particles = particles.slice(0, next);
      }
      for (const p of particles) {
        if (p.x > width) p.x = Math.random() * width;
        if (p.y > height) p.y = Math.random() * height;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Lines between near particles.
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= MAX_DIST * MAX_DIST) continue;
          const dist = Math.sqrt(d2);
          const t = 1 - dist / MAX_DIST;
          const alpha = 0.04 + t * 0.14;
          ctx.strokeStyle = `rgba(${accentRgb}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Particles.
      ctx.globalAlpha = 0.55;
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
        if (p.x < -p.r) p.x = width + p.r;
        else if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        else if (p.y > height + p.r) p.y = -p.r;
      }
      draw();
      rafId = requestAnimationFrame(step);
    };

    refreshAccent();
    resize();

    window.addEventListener('resize', resize);

    // Re-read accent if the theme attribute flips so the particles re-tint.
    const themeObserver = new MutationObserver(() => {
      refreshAccent();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    if (reducedMotion) {
      draw();
    } else {
      rafId = requestAnimationFrame(step);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70 [@media(prefers-reduced-motion:reduce)]:opacity-50"
    />
  );
}
