"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import EdgeTrim from "./components/EdgeTrim";
import { useRouter, usePathname } from "next/navigation";

const tabs = [
  { label: "about", href: "/" },
  { label: "now", href: "/now" },
  { label: "posts", href: "/posts" },
];

function tabIndex(pathname: string) {
  const exact = tabs.findIndex((t) => t.href === pathname);
  if (exact !== -1) return exact;
  return tabs.findIndex((t) => t.href !== "/" && pathname.startsWith(t.href));
}

const fmt = (d: Date) =>
  d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

/* The visitor's local time, 24h. Renders a placeholder on the server and
   ticks on each minute boundary. */
function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const d = new Date();
      setNow(d);
      timer = setTimeout(tick, 60_000 - (d.getSeconds() * 1000 + d.getMilliseconds()));
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <time className="clock" dateTime={now?.toISOString()} suppressHydrationWarning>
      {now ? fmt(now) : "--:--"}
    </time>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const lastKey = useRef<Record<string, number>>({});
  const active = tabIndex(pathname);

  const go = useCallback(
    (dir: 1 | -1) => {
      const from = active === -1 ? 0 : active;
      router.push(tabs[(from + dir + tabs.length) % tabs.length].href);
    },
    [active, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const now = Date.now();
      if (now - (lastKey.current[e.key] ?? 0) < 150) return;

      const actions: Record<string, () => void> = {
        j: () => window.scrollBy({ top: 100, behavior: "smooth" }),
        k: () => window.scrollBy({ top: -100, behavior: "smooth" }),
        h: () => go(-1),
        l: () => go(1),
      };
      const action = actions[e.key];
      if (!action) return;
      e.preventDefault();
      lastKey.current[e.key] = now;
      action();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  return (
    <header className="top rise" style={{ "--i": 0 } as React.CSSProperties}>
      <EdgeTrim edge="top">
        <Link href="/" className="wordmark" aria-label="home">
          <Clock />
        </Link>
      </EdgeTrim>
      <nav className="nav">
        {tabs.map((t, i) => (
          <Link key={t.href} href={t.href} {...(i === active ? { "aria-current": "page" } : {})}>
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
