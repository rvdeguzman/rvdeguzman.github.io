"use client";

import { useEffect, useRef } from "react";

// --- Simplex 2D noise (compact implementation) ---
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const GRAD = [
  [1, 1], [-1, 1], [1, -1], [-1, -1],
  [1, 0], [-1, 0], [0, 1], [0, -1],
];

const perm = new Uint8Array(512);
const permMod8 = new Uint8Array(512);
(() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (i * 16807 + 31) % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod8[i] = perm[i] & 7;
  }
})();

function simplex2(x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;

  const x0 = x - (i - t);
  const y0 = y - (j - t);

  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;

  const ii = i & 255;
  const jj = j & 255;

  let n = 0;

  let d = 0.5 - x0 * x0 - y0 * y0;
  if (d > 0) {
    d *= d;
    const g = GRAD[permMod8[ii + perm[jj]]];
    n += d * d * (g[0] * x0 + g[1] * y0);
  }

  d = 0.5 - x1 * x1 - y1 * y1;
  if (d > 0) {
    d *= d;
    const g = GRAD[permMod8[ii + i1 + perm[jj + j1]]];
    n += d * d * (g[0] * x1 + g[1] * y1);
  }

  d = 0.5 - x2 * x2 - y2 * y2;
  if (d > 0) {
    d *= d;
    const g = GRAD[permMod8[ii + 1 + perm[jj + 1]]];
    n += d * d * (g[0] * x2 + g[1] * y2);
  }

  return 70 * n;
}

function fbm(x: number, y: number, octaves = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let max = 0;
  for (let i = 0; i < octaves; i++) {
    value += simplex2(x * frequency, y * frequency) * amplitude;
    max += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value / max;
}

const DEFAULT_LINE_COLOR: [number, number, number] = [242, 173, 99];

export function WaveGrid({
  lineCount = 32,
  lineColor = DEFAULT_LINE_COLOR,
  speed = 0.2,
  strokeWidth = 0.8,
}: {
  lineCount?: number;
  lineColor?: [number, number, number];
  speed?: number;
  strokeWidth?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    let width = rect.width;
    let height = rect.height;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let animationId: number;
    let tick = 0;

    let gustStrength = 0;
    let gustTarget = 0;
    let gustCooldown = 0;
    let gustX = 0;

    const handleResize = () => {
      const r = container.getBoundingClientRect();
      width = r.width;
      height = r.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    const getGustInfluence = (x: number) => {
      const dist = Math.abs(x - gustX);
      const radius = width * 0.4;
      if (dist > radius) return 0;
      const t = dist / radius;
      return (1 - t * t) * (1 - t * t);
    };

    const [r, g, b] = lineColor;

    const animate = () => {
      tick += 0.008 * speed;

      gustCooldown -= 1;
      if (gustCooldown <= 0 && gustStrength < 0.05) {
        gustTarget = 0.6 + Math.random() * 0.8;
        gustX = Math.random() * width;
        gustCooldown = 300 + Math.random() * 500;
      }
      if (gustStrength < gustTarget) {
        gustStrength += (gustTarget - gustStrength) * 0.04;
      } else {
        gustStrength *= 0.985;
        gustTarget = 0;
      }

      ctx.clearRect(0, 0, width, height);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const spacing = height / (lineCount - 1);
      const padding = 50;
      const noiseScale = 0.0015;

      for (let i = 0; i < lineCount; i++) {
        const depth = i / (lineCount - 1);

        const depthSpeed = 0.5 + depth * 0.8;
        const depthOpacity = 0.12 + depth * 0.16;
        const depthStroke = strokeWidth * (0.6 + depth * 0.6);
        const depthAmplitude = 0.7 + depth * 0.5;

        const baseY = spacing * i;
        const timeOffset = tick * depthSpeed;

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${depthOpacity})`;
        ctx.lineWidth = depthStroke;
        ctx.beginPath();

        let started = false;
        for (let x = -padding; x <= width + padding; x += 3) {
          const nx = x * noiseScale;
          const ny = i * 0.4 + timeOffset;
          const ts = tick * depthSpeed;
          const xOff = x + i * 100;
          const scale = 0.003;

          const sines =
            Math.sin(xOff * scale * 2 + ts) * 30 +
            Math.sin(xOff * scale * 3.7 + ts * 0.7) * 20 +
            Math.sin(xOff * scale * 1.3 - ts * 0.5) * 40 +
            Math.sin(xOff * scale * 5.1 + ts * 1.2) * 10 +
            Math.sin(xOff * scale * 0.7 + ts * 0.3) * 50;
          const noise = fbm(nx, ny, 3) * 25;
          const terrain = (sines + noise) * depthAmplitude;
          const gust = getGustInfluence(x) * gustStrength * 60 * depthAmplitude;
          const y = baseY + terrain + gust;

          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      ro.disconnect();
    };
  }, [lineCount, lineColor, speed, strokeWidth]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
