import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
}

export function getEducation(): Education[] {
    if (!fs.existsSync(educationDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(educationDirectory);
    const education = fileNames
        .filter(name => name.endsWith('.md'))
        .map(name => {
            const slug = name.replace(/\.md$/, '');
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
        const fullPath = path.join(educationDirectory, `${slug}.md`);
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
