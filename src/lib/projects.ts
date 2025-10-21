import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const projectsDirectory = path.join(process.cwd(), 'src/content/projects');

export interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    featured: boolean;
    content: string;
    url?: string;
    color?: string;
    htmlContent?: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(markdown);
    return result.toString();
}

export function getProjects(): Project[] {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = fileNames
        .filter(name => name.endsWith('.mdx'))
        .map(name => {
            const slug = name.replace(/\.mdx$/, '');
            const fullPath = path.join(projectsDirectory, name);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title,
                description: data.description,
                tags: data.tags || [],
                featured: data.featured || false,
                content,
                url: data.url,
                color: data.color,
            };
        })
        .filter(project => project.featured);

    return projects;
}

export function getProject(slug: string): Project | null {
    try {
        const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title,
            description: data.description,
            tags: data.tags || [],
            featured: data.featured || false,
            content,
            url: data.url,
            color: data.color,
        };
    } catch {
        return null;
    }
}

export async function getProjectWithHtml(slug: string): Promise<(Project & { htmlContent: string }) | null> {
    const project = getProject(slug);
    if (!project) return null;
    
    const htmlContent = await markdownToHtml(project.content);
    return {
        ...project,
        htmlContent,
    };
}
