import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    color: string;
    published: boolean;
    content: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(markdown);
    return result.toString();
}

export function getPosts(): Post[] {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const posts = fileNames
        .filter(name => name.endsWith('.mdx'))
        .map(name => {
            const slug = name.replace(/\.mdx$/, '');
            const fullPath = path.join(postsDirectory, name);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title,
                description: data.description,
                date: data.date,
                color: data.color || 'gray',
                published: data.published !== false,
                content,
            };
        })
        .filter(post => post.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export function getPost(slug: string): Post | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title,
            description: data.description,
            date: data.date,
            color: data.color || 'gray',
            published: data.published !== false,
            content,
        };
    } catch {
        return null;
    }
}

export async function getPostWithHtml(slug: string): Promise<(Post & { htmlContent: string }) | null> {
    const post = getPost(slug);
    if (!post) return null;
    
    const htmlContent = await markdownToHtml(post.content);
    return {
        ...post,
        htmlContent,
    };
}
