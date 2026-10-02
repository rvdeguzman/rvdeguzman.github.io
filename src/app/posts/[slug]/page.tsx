import { getPosts, getPostWithHtml } from "../../../lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    return getPosts().map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostWithHtml(slug);

    if (!post || !post.published) {
        notFound();
    }

    return (
        <main>
            <header className="post-head rise" style={{ "--i": 1 } as React.CSSProperties}>
                <h1 className="page-title">{post.title.toLowerCase()}</h1>
                <p className="post-meta">
                    <span>{post.description.toLowerCase()}</span>
                    <span className="num">{post.date}</span>
                </p>
            </header>
            <article
                className="prose rise"
                style={{ "--i": 2 } as React.CSSProperties}
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
            />
        </main>
    );
}
