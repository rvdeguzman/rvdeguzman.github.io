import Header from "./header";
import { postsData } from "../data/posts";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <div className="space-y-8">
                    <section>
                        <h1 className="text-3xl font-bold mb-4">Lorem Ipsum</h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
                        <div className="space-y-4">
                            {postsData.map((post, idx) => (
                                <article key={idx} className={`border-l-4 border-${post.color}-500 pl-4`}>
                                    <h3 className="text-lg font-medium mb-2">
                                        <a href={post.href} className={`hover:text-${post.color}-600 transition-colors`}>
                                            {post.title}
                                        </a>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                        {post.description}
                                    </p>
                                    <time className="text-xs text-gray-500">{post.date}</time>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h3 className="font-medium mb-2">Task Management App</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    A React-based productivity app with drag-and-drop functionality
                                    and real-time collaboration features.
                                </p>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">React</span>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">Node.js</span>
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <h3 className="font-medium mb-2">Weather Dashboard</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Clean and minimal weather app with location-based forecasts
                                    and beautiful data visualizations.
                                </p>
                                <div className="flex gap-2 text-xs">
                                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">Vue.js</span>
                                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">API</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
