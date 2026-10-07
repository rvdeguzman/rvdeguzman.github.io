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
    /** Has its own /projects/[slug] page; the file body is the page's MDX. */
    page: boolean;
    content: string;
    url?: string;
    color?: string;
}

function readProject(slug: string): Project {
    const fileContents = fs.readFileSync(path.join(projectsDirectory, `${slug}.mdx`), 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug,
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        featured: data.featured || false,
        page: data.page === true,
        content,
        url: data.url,
        color: data.color,
    };
}

export function getAllProjects(): Project[] {
    if (!fs.existsSync(projectsDirectory)) {
        return [];
    }

    return fs.readdirSync(projectsDirectory)
        .filter(name => name.endsWith('.mdx'))
        .map(name => readProject(name.replace(/\.mdx$/, '')));
}

/** Projects shown on the homepage. */
export function getProjects(): Project[] {
    return getAllProjects().filter(project => project.featured);
}

/** Projects that get a /projects/[slug] page. */
export function getProjectPages(): Project[] {
    return getAllProjects().filter(project => project.page);
}

export function getProject(slug: string): Project | null {
    try {
        return readProject(slug);
    } catch {
        return null;
    }
}
