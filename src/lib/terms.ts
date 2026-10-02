// Academic terms for work + school dates: w (winter, Jan–Apr), s (summer,
// May–Aug), f (fall, Sep–Dec). Frontmatter can say `f25`, `F2025`, `2025-09`,
// or a YAML date; `now` (or no end at all) means ongoing.

export type Season = "w" | "s" | "f";
export type Term = { season: Season; year: number };

const SEASON_MONTH: Record<Season, number> = { w: 0, s: 4, f: 8 };

function seasonOf(month: number): Season {
    return month < 4 ? "w" : month < 8 ? "s" : "f";
}

/** Parse a frontmatter date; null for missing, empty or `now`. Throws on garbage. */
export function parseTerm(value: unknown, where = "date"): Term | null {
    if (value == null || value === "" || value === "now") return null;
    if (value instanceof Date) return { season: seasonOf(value.getUTCMonth()), year: value.getUTCFullYear() };

    const s = String(value).trim().toLowerCase();
    const term = s.match(/^([wsf])\s*(\d{2}|\d{4})$/);
    if (term) {
        const y = Number(term[2]);
        return { season: term[1] as Season, year: y < 100 ? 2000 + y : y };
    }
    const iso = s.match(/^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/);
    if (iso) return { season: seasonOf(Number(iso[2]) - 1), year: Number(iso[1]) };

    throw new Error(`${where}: can't read "${value}" as a term (try f25, F2025 or 2025-09)`);
}

/** f25 */
export function termLabel(t: Term): string {
    return `${t.season}${String(t.year % 100).padStart(2, "0")}`;
}

/** Comparable number, later terms are larger. */
export function termOrder(t: Term): number {
    return t.year * 12 + SEASON_MONTH[t.season];
}

/** "f25 - now", "w23 - f23", or "s24" when it starts and ends in the same term. */
export function spanLabel(start: Term, end: Term | null): string {
    if (!end) return `${termLabel(start)} - now`;
    if (termOrder(end) === termOrder(start)) return termLabel(start);
    return `${termLabel(start)} - ${termLabel(end)}`;
}

/** Ongoing first, then by most recent end (or start). */
export function bySpan<T extends { start: Term; end: Term | null }>(a: T, b: T): number {
    const key = (x: T) => (x.end ? termOrder(x.end) : Infinity);
    return key(b) - key(a) || termOrder(b.start) - termOrder(a.start);
}
