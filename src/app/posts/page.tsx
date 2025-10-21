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
                        <article key={idx} className="group" style={{ ...fadeInStyle(0.1 + idx * 0.1), '--hover-color': '#fbcb97' } as React.CSSProperties}>
                            <a href={`/posts/${post.slug}`} className="block border-l-4 pl-4" style={{ borderLeftColor: 'var(--line)' }}>
                                <h2 className="text-2xl font-medium mb-2 inline-block relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--hover-color)] after:transition-all after:duration-300 group-hover:after:w-full transition-colors group-hover:text-[var(--hover-color)]" style={{ color: 'var(--property)' }}>
                                    {post.title}
                                </h2>
                            </a>
                            <p className="text-sm mt-1 mb-2 pl-4" style={{ color: 'var(--comment)' }}>
                                {post.description}
                            </p>
                            <time className="text-xs pl-4" style={{ color: 'var(--operator)' }}>
                                {post.date}
                            </time>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
