import Header from "./header";
import TextModelWrapper from "./components/TextModelWrapper";
import Separator from "./components/Separator";
import ProjectCard from "./components/ProjectCard";
import { getPosts } from "../lib/posts";
import { getProjects } from "../lib/projects";
import { getAbout } from "../lib/about";
import { getExperiences } from "../lib/experiences";
import { getEducation } from "../lib/education";

export default function Home() {
    const about = getAbout();
    const experiences = getExperiences();
    const education = getEducation();
    const posts = getPosts();
    const projects = getProjects();
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8 pt-0">
                <div className="space-y-8">
                    { /* about me and model */}
                    <div className="flex flex-col lg:flex-row lg:items-stretch mb-0 lg:min-h-0">
                        <section className="lg:w-2/3">
                            {about ? (
                                <>
                                    <h1 className="text-3xl font-bold">{about.title}</h1>
                                    <h2 className="text-2xl text-gray-300">{about.description}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                        {about.location} | {about.email}
                                    </p>
                                    <div className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-gray text-justify dark:prose-invert max-w-none">
                                        {about.content.split('\n').map((line, idx) => (
                                            line.trim() ? <p key={idx} className="mb-4">{line}</p> : null
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold mb-4">About Me</h1>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        ...
                                    </p>
                                </>
                            )}
                        </section>

                        <div className="lg:w-1/3 mt-8 lg:mt-0">
                            <TextModelWrapper />
                        </div>
                    </div>

                    <Separator />

                    {/* experiences */}
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

                    <Separator />

                    {/* education */}
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

                    <Separator />

                    {/* projects */}
                    <ProjectCard projects={projects} />
                    <Separator />

                    { /* posts */}
                    < section >
                        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
                        {
                            posts.length === 0 ? (
                                <p className="text-gray-600 dark:text-gray-400">No posts available.</p>
                            ) : (
                                <div className="space-y-4">
                                    {
                                        posts.slice(0, 3).map((post, idx) => (
                                            <article key={idx} className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 group"
                                                style={{ '--hover-color': post.color } as React.CSSProperties}>
                                                <h3 className="text-lg font-medium mb-2">
                                                    <a href={`/posts/${post.slug}`} className="text-gray-900 dark:text-gray-100 transition-colors group-hover:text-[var(--hover-color)]">
                                                        {post.title}
                                                    </a>
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 text-justify">
                                                    {post.description}
                                                </p>
                                                <time className="text-xs text-gray-500">{post.date}</time>
                                            </article>
                                        ))
                                    }
                                </div>
                            )
                        }
                    </section >

                    {/* footer */}
                    <Separator />
                </div >
            </main >
        </div >
    );
}
