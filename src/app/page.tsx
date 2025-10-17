import Header from "./header";
import TextModelWrapper from "./components/TextModelWrapper";
import { getPosts } from "../lib/posts";
import { getProjects } from "../lib/projects";
import { getAbout } from "../lib/about";

export default function Home() {
    const about = getAbout();
    // const experiences = getExperiences();
    const posts = getPosts();
    const projects = getProjects();
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8 pt-0">
                <div className="space-y-8">
                    { /* about me */}
                    <section>
                        {about ? (
                            <>
                                <h1 className="text-3xl font-bold">{about.title}</h1>
                                <h2 className="text-2xl text-gray-300">{about.description}</h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                    {about.location} | {about.email}
                                </p>
                                <div className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-gray dark:prose-invert max-w-none">
                                    {about.content.split('\n').map((line, idx) => (
                                        line.trim() ? <p key={idx} className="mb-4">{line}</p> : null
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold mb-4">About Me</h1>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Welcome to my personal website. Content is loading...
                                </p>
                            </>
                        )}
                    </section>

                    { /* experiences */}
                    <section>
                    </section >

                    { /* projects */}
                    < section >
                        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {projects.map((project, idx) => (
                                <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <h3 className="font-medium mb-2">{project.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {project.description}
                                    </p>
                                    <div className="flex gap-2 text-xs">
                                        {project.tags.map((tag, tagIdx) => (
                                            <span key={tagIdx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section >

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
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
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
                    <div className="mb-0 border-t border-gray-200 dark:border-gray-700" />
                    <TextModelWrapper />
                    <div className="border-t border-gray-200 dark:border-gray-700" />
                </div >
            </main >
        </div >
    );
}
