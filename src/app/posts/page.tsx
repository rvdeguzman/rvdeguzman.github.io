import Header from "../header";
import { getAllPosts } from "../../lib/posts";

export default function Posts() {
    const posts = getAllPosts();
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold mb-4">Posts</h1>
                <div className="space-y-4">
                    {posts.map((post, idx) => (
                        <article key={idx} className="group">
                            <a href={`/posts/${post.slug}`} className="block">
                                <h2 className="text-2xl font-medium group-hover:text-gray-600 transition-colors duration-200">
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
