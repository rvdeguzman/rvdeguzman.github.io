import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, getProjectPages } from "../../../lib/projects";

interface ProjectPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Static export: only projects with `page: true` exist.
export const dynamicParams = false;

export function generateStaticParams() {
    return getProjectPages().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getProject(slug);
    return project
        ? { title: `${project.title.toLowerCase()} · rv`, description: project.description }
        : {};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = getProject(slug);

    if (!project || !project.page) {
        notFound();
    }

    // Compiled by @next/mdx at build time, so project pages can embed demos.
    const { default: Content } = await import(`@/content/projects/${slug}.mdx`);

    return (
        <main>
            <header className="post-head rise" style={{ "--i": 1 } as React.CSSProperties}>
                <h1 className="page-title">{project.title.toLowerCase()}</h1>
                <p className="post-meta">
                    <span>{project.description.toLowerCase()}</span>
                    {project.url && (
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                            {new URL(project.url).hostname.replace(/^www\./, "")} ↗
                        </a>
                    )}
                </p>
                {project.tags.length > 0 && (
                    <p className="post-meta">
                        <span>{project.tags.join(" · ").toLowerCase()}</span>
                    </p>
                )}
            </header>
            <article className="prose rise" style={{ "--i": 2 } as React.CSSProperties}>
                <Content />
            </article>
        </main>
    );
}
