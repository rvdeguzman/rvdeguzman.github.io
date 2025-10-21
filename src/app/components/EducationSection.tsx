import { Education } from "@/lib/education";
import Tag from "./Tag";

export default function EducationSection({ education }: { education: Education[] }) {

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            {
                education.length === 0 ? (
                    <p className="mb-4" style={{ color: 'var(--comment)' }}>No education available.</p>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: 'var(--line)' }} />
                        <div className="space-y-8">
                            {
                                education.map((edu, idx) => (
                                    <div key={idx} className="relative pl-24">
                                        <div className="absolute left-0 w-8 h-8 rounded-full border-2 overflow-hidden flex items-center justify-center p-1" style={{ borderColor: 'var(--line)', backgroundColor: 'var(--visual)' }}>
                                            <img
                                                src={edu.icon}
                                                alt={`${edu.school} logo`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-1">
                                                <h3 className="text-lg font-medium">{edu.school}</h3>
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
                                                <div className="ml-4 space-y-1">
                                                    {edu.subsections.map((subsection, subIdx) => (
                                                        <div key={subIdx} className="text-sm" style={{ color: 'var(--comment)' }}>
                                                            • {subsection.label}
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
