"use client";

import { useEffect, useRef, useState } from "react";
import { toBraille } from "../../vendor/braille-koi";
import type { Track } from "../../lib/playlist";

/* A random track off the playlist: pixelated cover, title, and a little
   braille equalizer cut from the same cloth as the koi pond. Each bar is one
   braille cell wide, two cells tall (8 levels); bars jump to the beat and
   fall back one dot per tick like an old stereo's meter. Hover turns it up. */

const INITIAL_BARS = 12;
const CELL_PX = 7; // Iosevka at 14px: each braille cell is half an em
const LEVELS = 8; // 2 rows x 4 dots
const TICK = 85; // ms per frame: stepped, so it reads as a meter
const BEAT = 500; // ms, ~120 bpm

// Spectral tilt: lows sit taller than highs.
const tilt = (i: number, bars: number) => 1 - 0.45 * (i / Math.max(1, bars - 1));

// Resting shape for SSR and reduced motion; deterministic so hydration matches.
const still = (bars: number) => Array.from({ length: bars }, (_, i) =>
  Math.max(1, Math.round(LEVELS * tilt(i, bars) * (0.45 + 0.25 * Math.sin(i * 1.3 + 0.6)))),
);

function draw(levels: number[]): string {
  const w = levels.length * 2;
  const fb = new Uint8Array(w * LEVELS);
  levels.forEach((h, i) => {
    for (let y = LEVELS - h; y < LEVELS; y++) {
      fb[y * w + i * 2] = 1;
      fb[y * w + i * 2 + 1] = 1;
    }
  });
  return toBraille(fb, w, LEVELS);
}

export default function NowPlaying({ tracks, label = "" }: { tracks: Track[]; label?: string }) {
  // Picked after mount so every visit gets a different one; until then the
  // panel holds its space invisibly instead of flashing a track then swapping.
  const [track, setTrack] = useState<Track | null>(null);
  const [text, setText] = useState(() => draw(still(INITIAL_BARS)));
  const loud = useRef(false);
  const eq = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setTrack(tracks[Math.floor(Math.random() * tracks.length)]);
  }, [tracks]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let levels = still(INITIAL_BARS);
    let visible = true;
    let timer = 0;
    const t0 = performance.now();

    const tick = () => {
      const t = performance.now() - t0;
      const kick = Math.exp(-(t % BEAT) / 110); // sharp attack, quick decay
      const gain = loud.current ? 1.25 : 0.9;
      for (let i = 0; i < levels.length; i++) {
        const punch = i < Math.ceil(levels.length / 3) ? kick : kick * 0.35;
        const target = Math.round(LEVELS * gain * tilt(i, levels.length) * (0.3 + 0.45 * punch + 0.45 * Math.random()));
        levels[i] = Math.max(1, Math.min(LEVELS, target > levels[i] ? target : levels[i] - 1));
      }
      setText(draw(levels));
    };

    const sync = () => {
      clearInterval(timer);
      timer = 0;
      if (reduce.matches) return setText(draw(still(levels.length)));
      if (visible && !document.hidden) timer = window.setInterval(tick, TICK);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const ro = new ResizeObserver(([entry]) => {
      const bars = Math.max(1, Math.floor(entry.contentRect.width / CELL_PX));
      if (bars === levels.length) return;
      levels = still(bars);
      setText(draw(levels));
    });
    if (eq.current) {
      io.observe(eq.current);
      ro.observe(eq.current);
    }
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      clearInterval(timer);
      io.disconnect();
      ro.disconnect();
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div className={`playing${track ? " is-ready" : ""}`}>
      <p className="playing-label">{label}</p>
      <a
        className="playing-track"
        href={track?.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={track ? `${label}: ${track.title} by ${track.artist}, open on Apple Music` : undefined}
        onPointerEnter={() => (loud.current = true)}
        onPointerLeave={() => (loud.current = false)}
        onFocus={() => (loud.current = true)}
        onBlur={() => (loud.current = false)}
      >
        <span className="playing-cover" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {track && <img src={track.cover} alt="" width={32} height={32} />}
        </span>
        <span className="playing-meta" aria-hidden="true">
          <span className="playing-title">{track?.title.toLowerCase()}</span>
          <span className="playing-artist">{track?.artist.toLowerCase()}</span>
          <span ref={eq} className="playing-eq">{text}</span>
        </span>
      </a>
    </div>
  );
}
