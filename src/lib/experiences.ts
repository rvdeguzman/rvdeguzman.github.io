import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const experiencesDirectory = path.join(process.cwd(), 'src/content/experiences');

export interface Experience {
    slug: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string | null;
    icon: string;
    tags: string[];
    content: string;
}

export function getExperiences(): Experience[] {
    if (!fs.existsSync(experiencesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(experiencesDirectory);
    const experiences = fileNames
        .filter(name => name.endsWith('.md'))
        .map(name => {
            const slug = name.replace(/\.md$/, '');
            const fullPath = path.join(experiencesDirectory, name);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                company: data.company,
                role: data.role,
                location: data.location,
                startDate: data.startDate,
                endDate: data.endDate || null,
                icon: data.icon,
                tags: data.tags || [],
                content,
            };
        })
        .sort((a, b) => {
            const aDate = new Date(a.endDate || a.startDate).getTime();
            const bDate = new Date(b.endDate || b.startDate).getTime();
            return bDate - aDate;
        });

    return experiences;
}

export function getExperience(slug: string): Experience | null {
    try {
        const fullPath = path.join(experiencesDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            company: data.company,
            role: data.role,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate || null,
            icon: data.icon,
            tags: data.tags || [],
            content,
        };
    } catch {
        return null;
    }
}
