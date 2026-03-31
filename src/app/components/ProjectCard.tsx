'use client';

import { Project } from "@/lib/projects";
import Tag from "./Tag";

export default function ProjectCard({ projects }: { projects: Project[] }) {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 ps2-glow-heading" style={{ color: 'var(--accent1)' }}>projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project, idx) => (
                    <div
                        key={idx}
                        className="ps2-card cursor-pointer group"
                        onClick={() => project.url && window.open(project.url, '_blank')}
                        style={{ '--hover-color': project.color } as React.CSSProperties}
                    >
                        <span className="ps2-corner ps2-corner-tl" />
                        <span className="ps2-corner ps2-corner-tr" />
                        <span className="ps2-corner ps2-corner-bl" />
                        <span className="ps2-corner ps2-corner-br" />
                        <h3 className="font-medium mb-2 text-sm transition-colors duration-300 group-hover:text-[var(--hover-color)]">{project.title}</h3>
                        <p className="text-xs mb-3" style={{ color: 'var(--comment)' }}>
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
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
