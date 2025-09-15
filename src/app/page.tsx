import Header from "./header";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <div className="space-y-8">
                    <section>
                        <h1 className="text-3xl font-bold mb-4">Welcome to My Website</h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Hi, I'm a software developer passionate about creating elegant solutions
                            and sharing knowledge. This is my personal space where I write about
                            technology, share projects, and document my learning journey.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
                        <div className="space-y-4">
                            <article className="border-l-4 border-amber-500 pl-4">
                                <h3 className="text-lg font-medium mb-2">
                                    <a href="/posts/getting-started-with-nextjs" className="hover:text-amber-600 transition-colors">
                                        Getting Started with Next.js 14
                                    </a>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                    A comprehensive guide to building modern web applications with Next.js,
                                    covering the latest features and best practices.
                                </p>
                                <time className="text-xs text-gray-500">March 15, 2024</time>
                            </article>

                            <article className="border-l-4 border-blue-500 pl-4">
                                <h3 className="text-lg font-medium mb-2">
                                    <a href="/posts/typescript-tips" className="hover:text-blue-600 transition-colors">
                                        TypeScript Tips for Better Code
                                    </a>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                    Essential TypeScript patterns and techniques that will make your code
                                    more maintainable and type-safe.
                                </p>
                                <time className="text-xs text-gray-500">March 8, 2024</time>
                            </article>

                            <article className="border-l-4 border-green-500 pl-4">
                                <h3 className="text-lg font-medium mb-2">
                                    <a href="/posts/css-grid-mastery" className="hover:text-green-600 transition-colors">
                                        Mastering CSS Grid Layout
                                    </a>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                    Deep dive into CSS Grid with practical examples and real-world
                                    use cases for creating responsive layouts.
                                </p>
                                <time className="text-xs text-gray-500">February 28, 2024</time>
                            </article>
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
