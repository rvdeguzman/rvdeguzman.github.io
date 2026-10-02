"use client";

import { useEffect, useRef, useState } from "react";

/* Hover text that decodes into another string through random ascii.
   Going there it resolves west → east (left to right), coming back it
   resolves east → west: a round trip. Every slot scrambles, even ones
   that end on the same letter, and interrupting mid-flight just retargets from wherever it is. */

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&@$~;:";
const STAGGER = 38; // ms between each slot starting
const SCRAMBLE = 240; // ms a slot spends scrambling before it locks
const TICK = 45; // ms between glyph changes, so it flickers rather than blurs

// Shorter string gets empty slots, so nothing trailing gets underlined.
const pad = (s: string, n: number) => Array.from({ length: n }, (_, i) => [...s][i] ?? "");
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

type Slot = { ch: string; live: boolean };

/* `fit` drops the fixed width so the box hugs whatever is showing, for spots
   where trailing space would read as a gap (e.g. before the hero's period). */
export default function Scramble({ from, to, label, fit = false }: { from: string; to: string; label: string; fit?: boolean }) {
    const len = Math.max([...from].length, [...to].length);
    const [slots, setSlots] = useState<Slot[]>(() => pad(from, len).map((ch) => ({ ch, live: false })));
    const settled = useRef(pad(from, len));
    const raf = useRef(0);
    const on = useRef(false);

    // Hover and focus both fire on a click, so ignore repeats.
    function go(next: boolean) {
        if (on.current === next) return;
        on.current = next;
        cancelAnimationFrame(raf.current);
        const target = pad(next ? to : from, len);

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            settled.current = target;
            setSlots(target.map((ch) => ({ ch, live: false })));
            return;
        }

        const order = target.map((_, i) => (next ? i : len - 1 - i));
        const t0 = performance.now();
        let lastTick = -Infinity;
        let shown = slots.map((s) => s.ch);

        const frame = (now: number) => {
            const t = now - t0;
            const tick = now - lastTick >= TICK;
            if (tick) lastTick = now;
            let done = true;

            const out = target.map((ch, i) => {
                const start = order[i] * STAGGER;
                if (t >= start + SCRAMBLE) {
                    settled.current[i] = ch;
                    return { ch, live: false };
                }
                done = false;
                if (t < start) return { ch: settled.current[i], live: false };
                if (tick || shown[i] === settled.current[i]) shown[i] = glyph();
                return { ch: shown[i], live: true };
            });

            shown = out.map((s) => s.ch);
            setSlots(out);
            if (!done) raf.current = requestAnimationFrame(frame);
        };
        raf.current = requestAnimationFrame(frame);
    }

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    return (
        <span
            className="scramble"
            tabIndex={0}
            onMouseEnter={() => go(true)}
            onMouseLeave={() => go(false)}
            onFocus={() => go(true)}
            onBlur={() => go(false)}
            style={fit ? undefined : { width: `${len}ch` }}
        >
            <span className="sr-only">{label}</span>
            <span aria-hidden="true">
                {slots.map((s, i) => (
                    <span key={i} className={s.live ? "scramble-live" : undefined}>{s.ch}</span>
                ))}
            </span>
        </span>
    );
}
