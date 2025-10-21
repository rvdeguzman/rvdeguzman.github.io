import Header from "../../header";
import { getPosts, getPostWithHtml } from "../../../lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

const fadeInStyle = (delay: number) => ({
    animation: `fadeIn 0.6s ease-in-out ${delay}s both`,
});

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
                .prose h1 {
                    font-size: 1.875rem;
                    font-weight: bold;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .prose h2 {
                    font-size: 1.5rem;
                    font-weight: 0.625rem;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .prose p {
                    margin-bottom: 1rem;
                }
                .prose ul, .prose ol {
                    margin-bottom: 1rem;
                    margin-left: 1.25rem;
                }
                .prose li {
                    margin-bottom: 0.5rem;
                }
                .prose code {
                    background-color: rgba(0, 0, 0, 0.05);
                    padding: 0.125rem 0.375rem;
                    border-radius: 0.25rem;
                }
                .prose pre {
                    background-color: rgba(0, 0, 0, 0.05);
                    padding: 1rem;
                    border-radius: 0.375rem;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                }
                .prose a {
                    color: #3b82f6;
                    text-decoration: underline;
                }
                .prose a:hover {
                    text-decoration: none;
                }
                .prose img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.375rem;
                    margin-bottom: 1rem;
                }
            `}</style>
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <div className="space-y-8">
                    <section style={fadeInStyle(0)}>
                        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                        <h1 className="text-xl text-gray-600 font-bold mb-2">{post.description}</h1>
                        <time className="text-sm text-gray-500 block">{post.date}</time>

                        <div
                            className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed"
                            style={fadeInStyle(0.1)}
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
