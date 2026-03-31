import Header from "../../header";
import { getPosts, getPostWithHtml } from "../../../lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export function generateStaticParams() {
    const posts = getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPostWithHtml(slug);

    if (!post || !post.published) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <style>{`
                .ps2-prose h1 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: var(--property);
                }
                .ps2-prose h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    color: var(--property);
                }
                .ps2-prose p {
                    margin-bottom: 1rem;
                    color: var(--comment);
                    font-size: 0.85rem;
                    line-height: 1.7;
                }
                .ps2-prose ul, .ps2-prose ol {
                    margin-bottom: 1rem;
                    margin-left: 1.25rem;
                    color: var(--comment);
                    font-size: 0.85rem;
                }
                .ps2-prose li {
                    margin-bottom: 0.5rem;
                }
                .ps2-prose code {
                    background: rgba(255, 255, 255, 0.06);
                    padding: 0.1em 0.35em;
                    border-radius: 3px;
                    font-size: 0.85em;
                    color: #a8b8d8;
                }
                .ps2-prose pre {
                    background: rgba(255, 255, 255, 0.04);
                    padding: 0.75rem;
                    border-radius: 4px;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                }
                .ps2-prose pre code {
                    background: none;
                    padding: 0;
                    border-radius: 0;
                }
                .ps2-prose a {
                    color: var(--accent1);
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                .ps2-prose a:hover {
                    text-shadow: 0 0 8px color-mix(in srgb, var(--accent1) 30%, transparent);
                }
                .ps2-prose img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 2px;
                    margin-bottom: 1rem;
                    opacity: 0.9;
                }
                .ps2-prose hr {
                    border: none;
                    height: 1px;
                    background: linear-gradient(to right, transparent, var(--line) 20%, var(--line) 80%, transparent);
                    margin: 1.5rem 0;
                }
                .ps2-prose blockquote {
                    border-left: 2px solid var(--line);
                    padding-left: 0.75rem;
                    margin: 0.75rem 0;
                    color: var(--comment);
                    font-style: italic;
                }
                .ps2-prose strong {
                    color: var(--property);
                    font-weight: 600;
                }
            `}</style>
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8 pt-0">
                <div className="ps2-glass p-6 md:p-8" style={{ animation: 'ps2-slide-in 0.4s ease both' }}>
                    <section>
                        <h1 className="text-2xl font-bold mb-2 ps2-glow-heading" style={{ color: 'var(--accent1)' }}>{post.title}</h1>
                        <p className="text-sm mb-1" style={{ color: 'var(--comment)' }}>{post.description}</p>
                        <time className="text-xs block mb-6" style={{ color: 'var(--operator)' }}>{post.date}</time>

                        <div
                            className="ps2-prose max-w-none"
                            style={{ animation: 'ps2-slide-in 0.4s ease 0.1s both' }}
                            dangerouslySetInnerHTML={{
                                __html: post.htmlContent,
                            }}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}
