// The site wears the same colorschemes as the editor. UI roles map to syntax
// roles so each scheme reads the way it does in nvim / doom:
//   section labels = keyword, links = string, dates = number,
//   hover + emphasis = type, statusline mode = function.
//
// Sources: ~/.config/ghostty/gruvbox.conf (gruvbox-material, which is what
// nvim's transparent gruvbox shows through), ~/.config/doom/themes/*.el.

export type Scheme = {
    bg: string; // Normal bg
    bg1: string; // frames, statusline
    line: string; // borders, rules
    plus: string; // alternating "+" / "x" grid texture
    fg: string; // Normal fg
    muted: string; // secondary text
    dim: string; // Comment
    kw: string; // Keyword
    str: string; // String
    num: string; // Number
    type: string; // Type
    fn: string; // Function
    orb: string; // ascii orb tint
    light?: boolean;
};

export const SCHEMES = {
    gruvbox: {
        bg: "#1d2021", bg1: "#232627", line: "#32302f", plus: "#2e2f2f",
        fg: "#d4be98", muted: "#a89984", dim: "#7c6f64",
        kw: "#ea6962", str: "#a9b665", num: "#d3869b", type: "#d8a657", fn: "#89b482",
        orb: "#d8a657",
    },
    miasma: {
        bg: "#222222", bg1: "#1c1c1c", line: "#333333", plus: "#2f2f2f",
        fg: "#c2c2b0", muted: "#929283", dim: "#666666",
        kw: "#5f875f", str: "#d7c483", num: "#bb7744", type: "#c9a554", fn: "#78834b",
        orb: "#c9a554",
    },
    "dark-funeral": {
        bg: "#000000", bg1: "#0b0b0b", line: "#1e1e1e", plus: "#1a1a1a",
        fg: "#c1c1c1", muted: "#979797", dim: "#525252",
        kw: "#5f8787", str: "#fbcb97", num: "#aaaaaa", type: "#d0dfee", fn: "#5f8787",
        orb: "#d0dfee",
    },
    emperor: {
        bg: "#000000", bg1: "#0b0b0b", line: "#1e1e1e", plus: "#1a1a1a",
        fg: "#c1c1c1", muted: "#979797", dim: "#525252",
        kw: "#5f8787", str: "#a8a1de", num: "#aaaaaa", type: "#a8a1de", fn: "#756482",
        orb: "#a8a1de",
    },
} satisfies Record<string, Scheme>;

export type SchemeName = keyof typeof SCHEMES;

export const SCHEME_NAMES = Object.keys(SCHEMES) as SchemeName[];

export const DEFAULT_SCHEME: SchemeName = "miasma";

export function getScheme(name: string | undefined): Scheme {
    return (SCHEMES as Record<string, Scheme>)[name ?? ""] ?? SCHEMES[DEFAULT_SCHEME];
}

/** One `[data-theme=…]` block per scheme, exposing tokens as --bg, --fg, … */
export function schemesCss(): string {
    return Object.entries(SCHEMES as Record<string, Scheme>)
        .map(([name, s]) => {
            const vars = Object.entries(s)
                .filter(([k]) => k !== "light")
                .map(([k, v]) => `--${k}:${v};`)
                .join("");
            return `[data-theme="${name}"]{${vars}color-scheme:${s.light ? "light" : "dark"};}`;
        })
        .join("\n");
}

/** Mix two #rrggbb colours; t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
    const pa = parseInt(a.slice(1), 16);
    const pb = parseInt(b.slice(1), 16);
    const ch = (shift: number) => {
        const x = (pa >> shift) & 255;
        const y = (pb >> shift) & 255;
        return Math.round(x + (y - x) * t);
    };
    return `#${((ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).padStart(6, "0")}`;
}
