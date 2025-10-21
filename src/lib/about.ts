import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const aboutDirectory = path.join(process.cwd(), 'src/content');

export interface About {
    title: string;
    description: string;
    location: string;
    email: string;
    content: string;
}

export function getAbout(): About | null {
    try {
        const fullPath = path.join(aboutDirectory, 'about.mdx');

        if (!fs.existsSync(fullPath)) {
            return null;
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            title: data.title || 'About Me',
            description: data.description || '',
            location: data.location || '',
            email: data.email || '',
            content,
        };
    } catch {
        return null;
    }
}

