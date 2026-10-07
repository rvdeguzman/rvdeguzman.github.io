import { getPosts, getPost } from "../../../lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Static export: only slugs from generateStaticParams exist.
export const dynamicParams = false;

export function generateStaticParams() {
    return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post || !post.published) {
        notFound();
    }

    // Compiled by @next/mdx at build time, so posts can use JSX and imports.
    const { default: Content } = await import(`@/content/posts/${slug}.mdx`);

    return (
        <main>
            <header className="post-head rise" style={{ "--i": 1 } as React.CSSProperties}>
                <h1 className="page-title">{post.title.toLowerCase()}</h1>
                <p className="post-meta">
                    <span>{post.description.toLowerCase()}</span>
                    <span className="num">{post.date}</span>
                </p>
            </header>
            <article className="prose rise" style={{ "--i": 2 } as React.CSSProperties}>
                <Content />
            </article>
        </main>
    );
}
