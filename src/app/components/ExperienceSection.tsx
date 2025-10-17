import { Experience } from "@/lib/experiences";

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4">Experience</h2>
            {
                experiences.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No experiences available.</p>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-8">
                            {
                                experiences.map((exp, idx) => (
                                    <div key={idx} className="relative pl-24">
                                        <div className="absolute left-0 w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center p-1">
                                            <img
                                                src={exp.icon}
                                                alt={`${exp.company} logo`}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-1">
                                                <h3 className="text-lg font-medium">{exp.company}</h3>
                                                <div className="flex flex-col items-start md:items-end">
                                                    <p className="text-xs text-gray-500">
                                                        {exp.startDate} - {exp.endDate ? exp.endDate : 'Present'}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {exp.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{exp.role}</p>
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
