import Header from "../header";
import { postsData } from "../../data/posts";

export default function Posts() {
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <h1 className="text-2xl font-semibold mb-8">Posts</h1>
                <div className="space-y-6">
                    {postsData.map((post, idx) => (
                        <article key={idx} className="group">
                            <a href={post.href} className="block">
                                <h2 className="text-lg font-medium group-hover:text-gray-600 transition-colors duration-200">
                                    {post.title}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-2">
                                    {post.description}
                                </p>
                                <time className="text-xs text-gray-500">
                                    {post.date}
                                </time>
                            </a>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}