import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const projectsDirectory = path.join(process.cwd(), 'src/content/projects');

export interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    featured: boolean;
    content: string;
}

export function getAllProjects(): Project[] {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(projectsDirectory);
    const projects = fileNames
        .filter(name => name.endsWith('.md'))
        .map(name => {
            const slug = name.replace(/\.md$/, '');
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
            };
        })
        .filter(project => project.featured);

    return projects;
}

export function getProject(slug: string): Project | null {
    try {
        const fullPath = path.join(projectsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title,
            description: data.description,
            tags: data.tags || [],
            featured: data.featured || false,
            content,
        };
    } catch {
        return null;
    }
}
