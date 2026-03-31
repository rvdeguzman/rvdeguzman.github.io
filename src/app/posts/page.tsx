import Header from "../header";
import { getPosts } from "../../lib/posts";

const slideIn = (delay: number) => ({
    animation: `ps2-slide-in 0.4s ease ${delay}s both`,
});

export default function Posts() {
    const posts = getPosts();
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8 pt-0">
                <div className="ps2-glass p-6 md:p-8">
                    <div style={slideIn(0)}>
                        <h1 className="text-2xl font-bold mb-6 ps2-glow-heading" style={{ color: 'var(--accent1)' }}>posts</h1>
                    </div>
                    <div className="space-y-4">
                        {posts.map((post, idx) => (
                            <article key={idx} className="ps2-post" style={slideIn(0.06 + idx * 0.06)}>
                                <a href={`/posts/${post.slug}`}>
                                    <h2 className="text-sm font-medium mb-1 ps2-post-title transition-all duration-300" style={{ color: 'var(--property)' }}>
                                        {post.title}
                                    </h2>
                                </a>
                                <p className="text-xs mt-1 mb-2" style={{ color: 'var(--comment)' }}>
                                    {post.description}
                                </p>
                                <time className="text-xs" style={{ color: 'var(--operator)' }}>
                                    {post.date}
                                </time>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
