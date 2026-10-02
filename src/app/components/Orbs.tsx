"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { getScheme, mix } from "../../lib/colorschemes";

const PS2Orbs = dynamic(() => import("./PS2Orbs").then((m) => m.PS2Orbs), { ssr: false });

/* ASCII PS2 orbs, tinted by the active colorscheme. The ascii renderer picks
   glyph density from scene luminance and glyph colour from scene colour, so
   the palette is the orb tint at a few brightness steps. */

export default function Orbs() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [reducedTime, setReducedTime] = useState<number | undefined>(undefined);
    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
        const sync = () => setReducedTime(reduce.matches ? Date.now() : undefined);
        sync();
        setMounted(true);
        reduce.addEventListener("change", sync);
        return () => reduce.removeEventListener("change", sync);
    }, []);
    const s = getScheme(theme);
    const palette = s.light
        ? { fg: s.orb, core: mix(s.orb, "#ffffff", 0.15), shell: s.orb, halo: mix(s.orb, s.bg, 0.35), trail: mix(s.orb, s.bg, 0.6) }
        : { fg: s.orb, core: mix(s.orb, "#ffffff", 0.45), shell: s.orb, halo: mix(s.orb, s.bg, 0.4), trail: mix(s.orb, s.bg, 0.7) };

    return (
        <div className="orbs">
            {mounted && (
                <PS2Orbs
                    mode="ascii"
                    resolution={1}
                    faithful
                    timeMs={reducedTime}
                    orbSize={1.6}
                    cameraZoom={1.5}
                    background="transparent"
                    palette={palette}
                />
            )}
        </div>
    );
}
