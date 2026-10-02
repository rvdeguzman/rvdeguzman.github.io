// Tracks from a public Apple Music playlist, read at build time.
//
// No API key: the playlist's public page ships its tracklist as JSON
// (<script id="serialized-server-data">). That's Apple's page format, not a
// documented API, so any surprise returns [] and the widget just hides.

export interface Track {
    title: string;
    artist: string;
    /** 32x32 PNG of the cover, scaled up with image-rendering: pixelated. */
    cover: string;
    /** Direct Apple Music song link. */
    url: string;
}

const COVER_PX = 32;

type Lockup = {
    title?: string;
    artistName?: string;
    artwork?: { dictionary?: { url?: string } };
    contentDescriptor?: { url?: string };
};

function findLockups(node: unknown): Lockup[] {
    if (Array.isArray(node)) {
        for (const child of node) {
            const found = findLockups(child);
            if (found.length) return found;
        }
    } else if (node && typeof node === "object") {
        const obj = node as Record<string, unknown>;
        if (obj.itemKind === "trackLockup" && Array.isArray(obj.items)) return obj.items as Lockup[];
        for (const child of Object.values(obj)) {
            const found = findLockups(child);
            if (found.length) return found;
        }
    }
    return [];
}

export async function getPlaylist(url: string): Promise<Track[]> {
    try {
        const res = await fetch(url, {
            headers: { "user-agent": "Mozilla/5.0 (Macintosh) rvdeguzman.github.io" },
            next: { revalidate: 86400 },
        });
        if (!res.ok) return [];
        const html = await res.text();
        const json = html.match(/<script[^>]*id="serialized-server-data"[^>]*>([\s\S]*?)<\/script>/)?.[1];
        if (!json) return [];

        return findLockups(JSON.parse(json)).flatMap((t) => {
            const art = t.artwork?.dictionary?.url;
            const songUrl = t.contentDescriptor?.url;
            if (!t.title || !t.artistName || !art || !songUrl) return [];
            return [{
                title: t.title,
                artist: t.artistName,
                cover: art.replace("{w}x{h}bb.{f}", `${COVER_PX}x${COVER_PX}bb.png`),
                url: songUrl,
            }];
        });
    } catch {
        return [];
    }
}
