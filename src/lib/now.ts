import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { renderNowMarkdown } from './now-markdown';

export interface Now {
    updated: string;
    content: string;
    /** Short preview shown on the homepage. */
    summary: string[];
    /** Public Apple Music playlist the "on repeat" track is drawn from. */
    playlist?: string;
}

export function getNow(): Now | null {
    try {
        const fullPath = path.join(process.cwd(), 'src/content/now.mdx');
        if (!fs.existsSync(fullPath)) return null;

        const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
        return {
            updated: data.updated || '',
            content,
            summary: Array.isArray(data.summary)
                ? data.summary.filter((item): item is string => typeof item === 'string')
                : [],
            playlist: data.playlist || undefined,
        };
    } catch {
        return null;
    }
}

export async function getNowWithHtml(): Promise<(Now & { htmlContent: string }) | null> {
    const now = getNow();
    if (!now) return null;

    const htmlContent = await renderNowMarkdown(now.content);
    return { ...now, htmlContent };
}
