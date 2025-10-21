import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

const educationDirectory = path.join(process.cwd(), 'src/content/education');

export interface Subsection {
    type: "experience" | "achievement";
    label: string;
    slug?: string;
}

export interface Education {
    slug: string;
    school: string;
    degree: string;
    major: string;
    location: string;
    startDate: string;
    endDate: string | null;
    dateLabel: string;
    icon: string;
    tags: string[];
    subsections: Subsection[];
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

export function getEducation(): Education[] {
    if (!fs.existsSync(educationDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(educationDirectory);
    const education = fileNames
        .filter(name => name.endsWith('.mdx'))
        .map(name => {
            const slug = name.replace(/\.mdx$/, '');
            const fullPath = path.join(educationDirectory, name);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            return {
                slug,
                school: data.school,
                degree: data.degree,
                major: data.major,
                location: data.location,
                startDate: data.startDate,
                endDate: data.endDate || null,
                dateLabel: data.dateLabel,
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

    return education;
}

export function getEducationItem(slug: string): Education | null {
    try {
        const fullPath = path.join(educationDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            school: data.school,
            degree: data.degree,
            major: data.major,
            location: data.location,
            startDate: data.startDate,
            endDate: data.endDate || null,
            dateLabel: data.dateLabel,
            icon: data.icon,
            tags: data.tags || [],
            subsections: data.subsections || [],
            content,
        };
    } catch {
        return null;
    }
}

export async function getEducationWithHtml(slug: string): Promise<(Education & { htmlContent: string }) | null> {
    const education = getEducationItem(slug);
    if (!education) return null;
    
    const htmlContent = await markdownToHtml(education.content);
    return {
        ...education,
        htmlContent,
    };
}
