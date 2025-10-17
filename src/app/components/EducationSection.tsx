import { Education } from "@/lib/education";

export default function EducationSection({ education }: { education: Education[] }) {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            {
                education.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No education available.</p>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-8">
                            {
                                education.map((edu, idx) => (
                                    <div key={idx} className="relative pl-24">
                                        <div className="absolute left-0 w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center p-1">
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
                                                    <p className="text-xs text-gray-500">
                                                        {edu.startDate} - {edu.endDate ? edu.endDate : 'Present'}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {edu.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{edu.major}, {edu.degree}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {edu.tags.map((tag, tagIdx) => (
                                                    <span key={tagIdx} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
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
