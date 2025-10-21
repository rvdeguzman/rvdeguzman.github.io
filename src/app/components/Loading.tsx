"use client";

import { useEffect, useState } from "react";

const SPINNER_FRAMES = [
    "⠋",
    "⠙",
    "⠹",
    "⠸",
    "⠼",
    "⠴",
    "⠦",
    "⠧",
    "⠇",
    "⠏"
];

export default function Loading() {
    const [frame, setFrame] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrame((prev) => (prev + 1) % SPINNER_FRAMES.length);
        }, 80);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full w-full rounded flex items-center justify-center min-h-0" style={{ backgroundColor: "var(--background)" }}>
            <div className="flex flex-col items-center gap-4">
                <div
                    className="text-6xl font-bold"
                    style={{ color: "var(--accent1)" }}
                >
                    {SPINNER_FRAMES[frame]}
                </div>
                <div
                    className="text-sm font-mono"
                    style={{ color: "var(--accent1)" }}
                >
                    initializing...
                </div>
            </div>
        </div>
    );
}
