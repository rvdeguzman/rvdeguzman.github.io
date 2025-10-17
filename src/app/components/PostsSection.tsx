import { Post } from "@/lib/posts";

export default function PostsSection({ posts }: { posts: Post[] }) {
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
            {
                posts.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">No posts available.</p>
                ) : (
                    <div className="space-y-4">
                        {
                            posts.slice(0, 3).map((post, idx) => (
                                <article key={idx} className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 group"
                                    style={{ '--hover-color': post.color } as React.CSSProperties}>
                                    <h3 className="text-lg font-medium mb-2">
                                        <a href={`/posts/${post.slug}`} className="text-gray-900 dark:text-gray-100 transition-colors group-hover:text-[var(--hover-color)]">
                                            {post.title}
                                        </a>
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 text-justify">
                                        {post.description}
                                    </p>
                                    <time className="text-xs text-gray-500">{post.date}</time>
                                </article>
                            ))
                        }
                    </div>
                )
            }
        </section>
    );
}
