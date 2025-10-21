import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const experiencesDirectory = path.join(process.cwd(), 'src/content/experiences');

export interface SubsectionItem {
    label: string;
}

export interface Experience {
    slug: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    dateLabel: string;
    endDate: string | null;
    icon: string;
    tags: string[];
    subsections: SubsectionItem[];
    content: string;
    htmlContent?: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(markdown);
    return result.toString();
}

export function getExperiences(): Experience[] {
    if (!fs.existsSync(experiencesDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(experiencesDirectory);
    const experiences = fileNames
        .filter(name => name.endsWith('.mdx'))
        .map(name => {
            const slug = name.replace(/\.mdx$/, '');
            const fullPath = path.join(experiencesDirectory, name);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                company: data.company,
                role: data.role,
                location: data.location,
                startDate: data.startDate,
                dateLabel: data.dateLabel,
                endDate: data.endDate || null,
                icon: data.icon,
                tags: data.tags || [],
                subsections: data.subsections || [],
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
        const fullPath = path.join(experiencesDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            company: data.company,
            role: data.role,
            location: data.location,
            startDate: data.startDate,
            dateLabel: data.dateLabel,
            endDate: data.endDate || null,
            icon: data.icon,
            tags: data.tags || [],
            subsections: data.subsections || [],
            content,
        };
    } catch {
        return null;
    }
}

export async function getExperienceWithHtml(slug: string): Promise<(Experience & { htmlContent: string }) | null> {
    const experience = getExperience(slug);
    if (!experience) return null;
    
    const htmlContent = await markdownToHtml(experience.content);
    return {
        ...experience,
        htmlContent,
    };
}
