import Header from "../header";
import { getPosts } from "../../lib/posts";

const fadeInStyle = (delay: number) => ({
    animation: `fadeIn 0.6s ease-in-out ${delay}s both`,
});

export default function Posts() {
    const posts = getPosts();
    return (
        <div className="min-h-screen">
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8 pt-0">
                <div style={fadeInStyle(0)}>
                    <h1 className="text-3xl font-bold mb-4">Posts</h1>
                </div>
                <div className="space-y-4">
                    {posts.map((post, idx) => (
                        <article key={idx} className="group" style={fadeInStyle(0.1 + idx * 0.1)}>
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
