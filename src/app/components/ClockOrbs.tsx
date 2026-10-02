"use client";

import { useEffect, useRef } from "react";

/* PS2 clock orbs in their original blue and white, driven by local time.
   Motion is the model measured from PS2 footage (orb-previews/NOTES.md):
    - one ring seen flat-on (orthographic)
    - the ring coin-spins about the hour-hand axis at 52/3 turns/min (free-running)
    - orb i rides the ring at (21 + i) turns/min from the hour point, so all
      seven meet on the hour hand at :00 and bunch into 60/gcd(s, 60) groups
    - the ring grows from 60% to 100% over the hour
   Departure from the PS2: instead of growing over the hour, the ring breathes
   between 75% and 100% on a 2-minute sine, smallest at the start of even
   minutes and largest at the start of odd ones. */

const TAU = Math.PI * 2;
const ORBS = 7;
const RIDE = 21;
const SPIN = 52 / 3;
const TRAIL_SECONDS = 0.6;
const TRAIL_STEPS = 36;

/** Ring radius at full size, as a fraction of min(width, height). Leaves room for the glow. */
const SCALE = 0.37;

type Point = { x: number; y: number };

/** Orb positions in ring units (x right, y up) at a wall-clock timestamp. */
function orbPositions(ms: number): Point[] {
    const d = new Date(ms);
    const s = d.getSeconds() + d.getMilliseconds() / 1000;
    const minuteOfHour = d.getMinutes() + s / 60;
    const hour = (d.getHours() % 12) + minuteOfHour / 60;
    const H = (hour / 12) * TAU; // hour-hand angle, clockwise from 12
    const ax = Math.sin(H), ay = Math.cos(H); // toward the hour point
    const bx = Math.cos(H), by = -Math.sin(H); // clockwise along the ring
    const psi = (TAU * SPIN * ms) / 60000; // coin spin, not locked to the minute
    const breath = ((d.getMinutes() % 2) * 60 + s) / 120; // 0..1 over two minutes
    const radius = 0.875 - 0.125 * Math.cos(TAU * breath);
    return Array.from({ length: ORBS }, (_, i) => {
        const th = (TAU * (RIDE + i) * s) / 60;
        const along = Math.cos(th);
        const across = Math.sin(th) * Math.cos(psi);
        return { x: radius * (along * ax + across * bx), y: radius * (along * ay + across * by) };
    });
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, now: number) {
    const R = Math.min(w, h) * SCALE, cx = w / 2, cy = h / 2;
    const at = (p: Point) => [cx + p.x * R, cy - p.y * R] as const;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    // Faint, thin comet trails.
    const past = Array.from({ length: TRAIL_STEPS + 1 }, (_, k) =>
        orbPositions(now - (TRAIL_SECONDS * 1000 * k) / TRAIL_STEPS),
    );
    for (let i = 0; i < ORBS; i++) {
        for (let k = TRAIL_STEPS; k > 0; k--) {
            const f = 1 - k / TRAIL_STEPS;
            const [x0, y0] = at(past[k][i]);
            const [x1, y1] = at(past[k - 1][i]);
            ctx.strokeStyle = `rgba(110,165,255,${0.32 * f ** 1.5})`;
            ctx.lineWidth = 0.6 + 2.2 * f;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }
    }

    // Blue glow, then white core. Sized and weighted to survive the CSS blur.
    for (const p of past[0]) {
        const [x, y] = at(p), g = R * 0.24, c = R * 0.09;
        const halo = ctx.createRadialGradient(x, y, 0, x, y, g);
        halo.addColorStop(0, "rgba(130,180,255,0.7)");
        halo.addColorStop(0.3, "rgba(60,115,240,0.3)");
        halo.addColorStop(1, "rgba(20,40,140,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, g, 0, TAU);
        ctx.fill();
        const core = ctx.createRadialGradient(x, y, 0, x, y, c);
        core.addColorStop(0, "rgba(255,255,255,1)");
        core.addColorStop(0.6, "rgba(240,246,255,1)");
        core.addColorStop(1, "rgba(160,200,255,0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(x, y, c, 0, TAU);
        ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
}

export default function ClockOrbs() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        let raf = 0, w = 0, h = 0, dpr = 1;

        const paint = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw(ctx, w, h, Date.now());
        };
        const frame = () => {
            paint();
            raf = requestAnimationFrame(frame);
        };
        const start = () => {
            cancelAnimationFrame(raf);
            if (reduce.matches) paint(); // frozen at the current time
            else raf = requestAnimationFrame(frame);
        };
        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            paint();
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();
        start();
        reduce.addEventListener("change", start);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            reduce.removeEventListener("change", start);
        };
    }, []);

    return (
        <div className="orbs">
            <canvas ref={canvasRef} className="orbs-canvas" />
        </div>
    );
}
