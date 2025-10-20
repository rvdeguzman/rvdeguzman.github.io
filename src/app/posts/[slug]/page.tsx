import Header from "../../header";
import { getPost, getPosts } from "../../../lib/posts";
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
    const post = getPost(slug);

    if (!post) {
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
            `}</style>
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <div className="space-y-8">
                    <section style={fadeInStyle(0)}>
                        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                        <time className="text-sm text-gray-500 block mb-4">{post.date}</time>

                        <div
                            className="text-gray-600 dark:text-gray-400 leading-relaxed"
                            style={fadeInStyle(0.1)}
                            dangerouslySetInnerHTML={{
                                __html: post.content
                                    .replace(/^## (.*)$/gm, '<h2 class="text-2xl font-semibold mt-8 mb-4">$1</h2>')
                                    .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
                                    .replace(/\n\n/g, '</p><p class="mb-4">')
                                    .replace(/^(.*)$/gm, '<p class="mb-4">$1</p>')
                                    .replace(/<p class="mb-4"><h/g, '<h')
                                    .replace(/h><\/p>/g, 'h>')
                            }}
                        />
                    </section>
                </div>
            </main>
        </div>
    );
}
