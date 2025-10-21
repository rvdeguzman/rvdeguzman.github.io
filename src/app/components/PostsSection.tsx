import { Post } from "@/lib/posts";

export default function PostsSection({ posts }: { posts: Post[] }) {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
            {
                posts.length === 0 ? (
                    <p className="mb-4" style={{ color: 'var(--comment)' }}>No posts available.</p>
                ) : (
                    <div className="space-y-4">
                        {
                            posts.slice(0, 3).map((post, idx) => (
                                <article key={idx} className="border-l-4 pl-4 group cursor-pointer"
                                    style={{ '--hover-color': '#fbcb97', borderLeftColor: 'var(--line)' } as React.CSSProperties}>
                                    <a href={`/posts/${post.slug}`} style={{ color: 'inherit' }}>
                                        <h3 className="text-lg font-medium mb-2 inline-block relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--hover-color)] after:transition-all after:duration-300 group-hover:after:w-full transition-colors group-hover:text-[var(--hover-color)]" style={{ color: 'var(--property)' }}>
                                            {post.title}
                                        </h3>
                                    </a>
                                    <p className="text-sm mb-2 text-justify" style={{ color: 'var(--comment)' }}>
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
