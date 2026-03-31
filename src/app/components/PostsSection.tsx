import { Post } from "@/lib/posts";

export default function PostsSection({ posts }: { posts: Post[] }) {
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4 ps2-glow-heading" style={{ color: 'var(--accent1)' }}>latest posts</h2>
            {
                posts.length === 0 ? (
                    <p className="mb-4" style={{ color: 'var(--comment)' }}>no posts available.</p>
                ) : (
                    <div className="space-y-4">
                        {
                            posts.slice(0, 3).map((post, idx) => (
                                <article key={idx} className="ps2-post">
                                    <a href={`/posts/${post.slug}`} style={{ color: 'inherit' }}>
                                        <h3 className="text-sm font-medium mb-1 ps2-post-title transition-all duration-300" style={{ color: 'var(--property)' }}>
                                            {post.title}
                                        </h3>
                                    </a>
                                    <p className="text-xs mb-2 text-justify" style={{ color: 'var(--comment)' }}>
                                        {post.description}
                                    </p>
                                    <time className="text-xs" style={{ color: 'var(--operator)' }}>{post.date}</time>
                                </article>
                            ))
                        }
                    </div>
                )
            }
        </section>
    );
}
