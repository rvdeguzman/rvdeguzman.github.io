"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import "./picker.css";
import "./proto.css";
import Paper from "./Paper";
import Terminal from "./Terminal";
import Garden from "./Garden";
import Readme from "./Readme";
import Changelog from "./Changelog";
import Shell from "./Shell";

const variants = [
    { name: "Paper", Component: Paper },
    { name: "Terminal", Component: Terminal },
    { name: "Garden", Component: Garden },
    { name: "Readme", Component: Readme },
    { name: "Changelog", Component: Changelog },
    { name: "Shell", Component: Shell },
];

export default function PrototypePage() {
    const [current, setCurrent] = useState(0);
    const [mountKey, setMountKey] = useState(0);
    const pickerRef = useRef<HTMLElement>(null);
    const highlightRef = useRef<HTMLSpanElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const moveHighlight = () => {
        const el = itemRefs.current[current];
        const highlight = highlightRef.current;
        if (!el || !highlight) return;
        highlight.style.width = el.offsetWidth + "px";
        highlight.style.transform = `translateX(${el.offsetLeft}px)`;
    };

    useLayoutEffect(moveHighlight, [current]);

    useEffect(() => {
        const v = parseInt(new URLSearchParams(window.location.search).get("v") ?? "", 10);
        if (v >= 1 && v <= variants.length) setCurrent(v - 1);
        window.addEventListener("resize", moveHighlight);
        // Enable the slide only after first paint, so load doesn't animate.
        let raf2 = 0;
        const raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => pickerRef.current?.setAttribute("data-ready", ""));
        });
        return () => {
            window.removeEventListener("resize", moveHighlight);
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.set("v", String(current + 1));
        window.history.replaceState(null, "", url);
    }, [current]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement;
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            const num = parseInt(e.key, 10);
            if (num >= 1 && num <= variants.length) setCurrent(num - 1);
            else if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % variants.length);
            else if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + variants.length) % variants.length);
            else if (e.key === "r" || e.key === "R") setMountKey((k) => k + 1);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const { Component } = variants[current];

    return (
        <>
            <Component key={`${current}-${mountKey}`} />
            <nav className="proto-picker" aria-label="Prototype variants" ref={pickerRef}>
                <span className="proto-picker-highlight" aria-hidden="true" ref={highlightRef} />
                {variants.map((v, i) => (
                    <button
                        key={v.name}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        className="proto-picker-item"
                        {...(i === current ? { "data-active": true, "aria-current": true } : {})}
                        onClick={() => setCurrent(i)}
                    >
                        {v.name}
                    </button>
                ))}
                <span className="proto-picker-divider" aria-hidden="true" />
                <button
                    className="proto-picker-item proto-picker-replay"
                    aria-label="Replay animation (R)"
                    onClick={() => setMountKey((k) => k + 1)}
                >
                    ↻
                </button>
            </nav>
        </>
    );
}
