import { Education } from "@/lib/education";
import Tag from "./Tag";

export default function EducationSection({ education }: { education: Education[] }) {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 ps2-glow-heading" style={{ color: 'var(--accent1)' }}>education</h2>
            {
                education.length === 0 ? (
                    <p className="mb-4" style={{ color: 'var(--comment)' }}>no education available.</p>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-px ps2-timeline-line" />
                        <div className="space-y-8">
                            {
                                education.map((edu, idx) => (
                                    <div key={idx} className="relative pl-24" style={{ animation: `ps2-slide-in 0.35s ease ${idx * 0.06}s both` }}>
                                        <div className="absolute left-0 w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center p-1" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--background)' }}>
                                            <img
                                                src={edu.icon}
                                                alt={`${edu.school} logo`}
                                                className="w-full h-full object-contain"
                                                style={{ backgroundColor: 'var(--background)' }}
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-1">
                                                <h3 className="text-base font-medium">{edu.school}</h3>
                                                <div className="flex flex-col items-start md:items-end">
                                                    <p className="text-xs" style={{ color: 'var(--operator)' }}>
                                                        {edu.dateLabel}
                                                    </p>
                                                    <p className="text-xs" style={{ color: 'var(--comment)' }}>
                                                        {edu.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm mb-2" style={{ color: 'var(--comment)' }}>{edu.major}, {edu.degree}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {edu.tags.map((tag, tagIdx) => (
                                                    <Tag key={tagIdx} text={tag} />
                                                ))}
                                            </div>
                                            {edu.subsections.length > 0 && (
                                                <div className="ml-4 mt-2 space-y-1">
                                                    {edu.subsections.map((subsection, subIdx) => (
                                                        <div key={subIdx} className="text-xs" style={{ color: 'var(--comment)' }}>
                                                            &bull; {subsection.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </section>
    );
}
