import Header from "../../header";
import { getPost, getAllPosts } from "../../../lib/posts";
import { notFound } from "next/navigation";

interface PostPageProps {
    params: {
        slug: string;
    };
}

export function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function PostPage({ params }: PostPageProps) {
    const post = getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8">
                <article className="prose prose-gray dark:prose-invert max-w-none">
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <time className="text-sm text-gray-500 block mb-8">{post.date}</time>

                    <div
                        className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />').replace(/## (.*)/g, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>').replace(/# (.*)/g, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>') }}
                    />
                </article>
            </main>
        </div>
    );
}