import { defaultSchema } from 'hast-util-sanitize';
import type { Root } from 'mdast';
import remarkDirective from 'remark-directive';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const topics = ['activity', 'hobby', 'music', 'reading'] as const;
const topicClasses = topics.map((topic) => `topic-${topic}`);

/** Turn inline annotations such as :hobby[gunpla] into themed spans. */
function remarkTopics() {
    return (tree: Root) => {
        visit(tree, 'textDirective', (node) => {
            if (!topics.some((topic) => topic === node.name)) return;

            const data = node.data || (node.data = {});
            data.hName = 'span';
            // Ignore author-supplied attributes; only these fixed classes are allowed.
            data.hProperties = { className: ['topic', `topic-${node.name}`] };
        });
    };
}

export async function renderNowMarkdown(content: string): Promise<string> {
    const result = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(remarkTopics)
        .use(remarkHtml, {
            sanitize: {
                ...defaultSchema,
                attributes: {
                    ...defaultSchema.attributes,
                    span: [
                        ...(defaultSchema.attributes?.span || []),
                        ['className', 'topic', ...topicClasses],
                    ],
                },
            },
        })
        .process(content);

    return result.toString();
}
