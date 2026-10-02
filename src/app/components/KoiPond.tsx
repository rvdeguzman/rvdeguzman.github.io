"use client";

import { useEffect, useRef, useState } from "react";
import { BrailleKoi } from "../../vendor/braille-koi";

/* A strip of braille koi pond under the intro, as wide as the column.
   Iosevka braille cells are 0.5em x 1em at line-height 1, each one 2 x 4
   pond pixels, so the pond is sized in whole cells to fill the frame.
   Its edges fade out (.koi-pond in globals.css) so clipped ripples don't show. */

const FONT_PX = 14;
const CELL_W = FONT_PX / 2;
const ROWS = 11;

export default function KoiPond() {
    const water = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState(0);
    const [fish, setFish] = useState(3);

    useEffect(() => {
        const el = water.current;
        if (!el) return;
        // Pick once per mount, not on each resize; all counts from 3–7 are equally likely.
        const fishCount = 3 + Math.floor(Math.random() * 5);
        const ro = new ResizeObserver(([entry]) => {
            setCols(Math.floor(entry.contentRect.width / CELL_W));
            setFish(fishCount);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const width = cols * 2;
    const height = ROWS * 4;

    return (
        <div className="koi">
            <div ref={water} className="koi-water" style={{ height: ROWS * FONT_PX }}>
                {cols > 0 && (
                    <BrailleKoi
                        width={width}
                        height={height}
                        fish={fish}
                        mouse
                        keys="random"
                        label="koi pond: type, click, or rest the cursor in the water"
                        className="koi-pond"
                        style={{ fontSize: FONT_PX }}
                    />
                )}
            </div>
        </div>
    );
}
