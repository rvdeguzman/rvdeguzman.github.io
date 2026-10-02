import Link from "next/link";
import { getPosts } from "../../lib/posts";

export default function Posts() {
    const posts = getPosts();
    return (
        <main>
            <h1 className="page-title rise" style={{ "--i": 1 } as React.CSSProperties}>posts</h1>
            <div className="rows rise" style={{ "--i": 2 } as React.CSSProperties}>
                {posts.map((p) => (
                    <Link key={p.slug} href={`/posts/${p.slug}`} className="row">
                        <span className="row-title">{p.title.toLowerCase()}</span>
                        <span className="row-desc">{p.description.toLowerCase()}</span>
                        <span className="row-meta num">{p.date}</span>
                    </Link>
                ))}
            </div>
        </main>
    );
}
