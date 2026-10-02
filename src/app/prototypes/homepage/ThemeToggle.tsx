"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <span className={className} style={{ display: "inline-block", width: "3.2em" }} />;
    }

    const dark = theme === "dark";
    return (
        <button
            className={className}
            onClick={() => setTheme(dark ? "light" : "dark")}
            aria-label="toggle theme"
        >
            {dark ? "[light]" : "[dark]"}
        </button>
    );
}
