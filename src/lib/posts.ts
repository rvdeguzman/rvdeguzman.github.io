import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    color: string;
    content: string;
}

export function getPosts(): Post[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .filter(name => name.endsWith('.md'))
        .map(name => {
            const slug = name.replace(/\.md$/, '');
            const fullPath = path.join(postsDirectory, name);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title,
                description: data.description,
                date: data.date,
                color: data.color || 'gray',
                content,
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export function getPost(slug: string): Post | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title,
            description: data.description,
            date: data.date,
            color: data.color || 'gray',
            content,
        };
    } catch {
        return null;
    }
}
