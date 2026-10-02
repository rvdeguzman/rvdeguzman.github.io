"use client";

import { useEffect, useState } from "react";
import { PS2Orbs } from "./PS2Orbs";

const DARK_PALETTE = {
    fg: "#ffffff",
    core: "#ffffff",
    shell: "#f6f8ff",
    halo: "#8ea3df",
    trail: "#4d68b5",
};

function readPalette() {
    if (document.documentElement.classList.contains("dark")) {
        return DARK_PALETTE;
    }
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) =>
        styles.getPropertyValue(name).trim() || fallback;
    return {
        fg: token("--foreground", "#c1c1c1"),
        core: token("--foreground", "#c1c1c1"),
        shell: token("--type", "#d0dfee"),
        halo: "#e0803d",
        trail: "#b04a12",
    };
}

export default function TextModelCanvas() {
    const [palette, setPalette] = useState(readPalette);

    useEffect(() => {
        const observer = new MutationObserver(() => setPalette(readPalette()));
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex h-full w-full min-h-0 items-center justify-center">
            <div className="aspect-square h-full w-full overflow-hidden rounded-xl" style={{ background: 'transparent' }}>
                <PS2Orbs
                    mode="ascii"
                    faithful
                    resolution={1}
                    orbSize={1.6}
                    background="transparent"
                    palette={palette}
                />
            </div>
        </div>
    );
}
