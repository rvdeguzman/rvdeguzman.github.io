'use client';

import { Project } from "@/lib/projects";
import Tag from "./Tag";

export default function ProjectCard({ projects }: { projects: Project[] }) {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className="p-4 border rounded-lg text-justify cursor-pointer transition-all duration-200 hover:shadow-lg group"
                        onClick={() => project.url && window.open(project.url, '_blank')}
                        style={{ '--hover-color': project.color, borderColor: 'var(--line)' } as React.CSSProperties}
                    >
                        <h3 className="font-medium mb-2 inline-block relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--hover-color)] after:transition-all after:duration-300 group-hover:after:w-full transition-colors group-hover:text-[var(--hover-color)]">{project.title}</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--comment)' }}>
                            {project.description}
                        </p>
                        <div className="flex gap-2 text-xs">
                            {project.tags.map((tag, tagIdx) => (
                                <Tag key={tagIdx} text={tag} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
