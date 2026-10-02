"use client";

import { useEffect, useMemo, useRef, type CSSProperties, type PointerEvent } from "react";
import { blankBraille, toBraille } from "./braille";
import { keyPosition } from "./keymap";
import { Pond } from "./pond";

export type BrailleKoiProps = {
  /** Pond width in pixels (2 per character). Default 128, the OLED. */
  width?: number;
  /** Pond height in pixels (4 per line). Default 32, the OLED. */
  height?: number;
  /** Number of koi. Default 3. */
  fish?: number;
  /** RNG seed. */
  seed?: number;
  /** Frames per second. Default 30. */
  fps?: number;
  /**
   * Keypresses anywhere on the page drop ripples. `"keyboard"` (or `true`)
   * puts each ripple where the key sits on a split keyboard; `"random"` puts
   * it anywhere in the pond; `false` ignores keys. Default true.
   */
  keys?: boolean | "keyboard" | "random";
  /** Clicking/tapping the pond drops a ripple there. Default true. */
  clicks?: boolean;
  /**
   * The cursor moves through the water: it leaves a wake (stronger while
   * dragging), koi bolt from a fast cursor and drift up to a resting one.
   * Default false.
   */
  mouse?: boolean;
  /** Freeze the pond. */
  paused?: boolean;
  /** Called with the framebuffer after every frame (e.g. to draw an OLED preview). */
  onFrame?: (fb: Uint8Array, width: number, height: number) => void;
  className?: string;
  style?: CSSProperties;
  /** Accessible label. Default "Koi pond". */
  label?: string;
};

const WPM_WINDOW_MS = 5000;

const baseStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  lineHeight: 1,
  letterSpacing: 0,
  whiteSpace: "pre",
  fontFamily: 'Iosevka, "Apple Braille", "Segoe UI Symbol", "DejaVu Sans Mono", monospace',
  fontVariantLigatures: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  cursor: "default",
};

export function BrailleKoi({
  width = 128,
  height = 32,
  fish = 3,
  seed,
  fps = 30,
  keys = true,
  clicks = true,
  mouse = false,
  paused = false,
  onFrame,
  className,
  style,
  label = "Koi pond",
}: BrailleKoiProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const pond = useMemo(() => new Pond({ width, height, fish, seed }), [width, height, fish, seed]);
  const presses = useRef<number[]>([]);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  const wpm = (now: number) => {
    const p = presses.current;
    while (p.length && now - p[0] > WPM_WINDOW_MS) p.shift();
    // 5 characters per word, extrapolated to a minute
    return (p.length / 5) * (60000 / WPM_WINDOW_MS);
  };

  const draw = (now: number) => {
    const fb = pond.render(now, wpm(now));
    if (preRef.current) preRef.current.textContent = toBraille(fb, pond.width, pond.height);
    onFrameRef.current?.(fb, pond.width, pond.height);
  };

  // animation loop: throttled, paused while off screen or for reduced motion
  useEffect(() => {
    const el = preRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;
    let lastFrame = 0;
    const interval = 1000 / Math.max(1, fps);

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - lastFrame < interval - 1) return;
      lastFrame = t;
      draw(performance.now());
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (paused || reduce.matches) {
        draw(performance.now()); // a still pond
        return;
      }
      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    reduce.addEventListener("change", sync);
    sync();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      reduce.removeEventListener("change", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pond, fps, paused]);

  // keypresses anywhere ripple where the key sits on the split keyboard,
  // or at a random spot (also the fallback for unmapped keys)
  useEffect(() => {
    if (!keys) return;
    const placement = keys === "random" ? "random" : "keyboard";
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const now = performance.now();
      presses.current.push(now);
      const pos = placement === "keyboard" ? keyPosition(e.code) : undefined;
      if (pos) pond.key(pos[0], pos[1], now);
      else pond.dropRandom(now);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keys, pond]);

  const toPond = (e: PointerEvent<HTMLPreElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * pond.width, ((e.clientY - r.top) / r.height) * pond.height] as const;
  };
  const onPointerDown = (e: PointerEvent<HTMLPreElement>) => {
    const [x, y] = toPond(e);
    if (clicks) pond.drop(x, y, performance.now());
    if (mouse) pond.pointer(x, y, performance.now(), true);
  };
  const onPointerMove = (e: PointerEvent<HTMLPreElement>) => {
    if (!mouse) return;
    const [x, y] = toPond(e);
    pond.pointer(x, y, performance.now(), e.buttons > 0);
  };
  const onPointerLeave = () => pond.pointerLeave();

  return (
    <div role="img" aria-label={label} className={className} style={{ display: "inline-block", ...style }}>
      <pre
        ref={preRef}
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerCancel={onPointerLeave}
        // let touch drags stir the water sideways while still scrolling the page
        style={mouse ? { ...baseStyle, touchAction: "pan-y" } : baseStyle}
      >
        {blankBraille(width, height)}
      </pre>
    </div>
  );
}
