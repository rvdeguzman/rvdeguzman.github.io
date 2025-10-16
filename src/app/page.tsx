import Header from "./header";
import { getPosts } from "../lib/posts";
import { getProjects } from "../lib/projects";

export default function Home() {
    // const about = getAbout();
    // const experiences = getExperiences();
    const posts = getPosts();
    const projects = getProjects();
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <div className="space-y-8">
                    { /* about me */}
                    <section>
                        <h1 className="text-3xl font-bold mb-4">Lorem Ipsum</h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </section>

                    { /* experiences */}
                    <section>
                    </section>

                    { /* posts */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
                        {posts.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No posts available.</p>
                        ) : (
                            <div className="space-y-4">
                                { /* get the 3 most recent posts */}
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
                        )}
                    </section>

                    { /* projects */}
                    <section>
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
                    </section>

                    {/* footer */}
                    <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-left">
                        { /* 
                            <img
                                src="/conu.gif"
                                alt="Concordia University"
                                className="w-22 h-8"
                                width={88}
                                height={31}
                            />
                            */}
                    </div>
                </div>
            </main>
        </div>
    );
}
