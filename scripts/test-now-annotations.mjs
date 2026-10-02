import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import matter from 'gray-matter';
import { renderNowMarkdown } from '../src/lib/now-markdown.ts';

for (const topic of ['activity', 'hobby', 'music', 'reading']) {
  test(`renders :${topic} as a themed span`, async () => {
    assert.equal(
      await renderNowMarkdown(`before :${topic}[some words] after`),
      `<p>before <span class="topic topic-${topic}">some words</span> after</p>\n`,
    );
  });
}

test('keeps links and emphasis inside annotations', async () => {
  const html = await renderNowMarkdown(':reading[[the **boar book**](https://dataintensive.net/)]');
  assert.equal(
    html,
    '<p><span class="topic topic-reading"><a href="https://dataintensive.net/">the <strong>boar book</strong></a></span></p>\n',
  );
});

test('leaves code and ordinary Markdown alone', async () => {
  const html = await renderNowMarkdown('`:hobby[gunpla]`\n\n```\n:music[piano]\n```\n\n[ordinary link](https://example.com)');
  assert.ok(html.includes('<code>:hobby[gunpla]</code>'));
  assert.ok(html.includes('<pre><code>:music[piano]\n</code></pre>'));
  assert.ok(html.includes('<a href="https://example.com">ordinary link</a>'));
  assert.ok(!html.includes('class="topic'));
});

test('does not assign topic colors to unknown or block directives', async () => {
  const html = await renderNowMarkdown(':unknown[words]\n\n::hobby[words]\n\n:::music\nwords\n:::');
  assert.ok(!html.includes('class="topic'));
});

test('keeps sanitization enabled and ignores directive attributes', async () => {
  const html = await renderNowMarkdown(':hobby[gunpla]{onclick="alert(1)" style="color:red" .unexpected}\n\n:reading[[bad](javascript:alert%281%29)]\n\n<script>alert(1)</script>');
  assert.ok(html.includes('<span class="topic topic-hobby">gunpla</span>'));
  assert.ok(!/onclick|style=|unexpected|javascript:|<script/.test(html));
});

test('renders the actual now page annotations', async () => {
  const { content } = matter(readFileSync(new URL('../src/content/now.mdx', import.meta.url), 'utf8'));
  const html = await renderNowMarkdown(content);
  assert.ok(html.includes('<span class="topic topic-hobby">gunpla</span>'));
  assert.ok(html.includes('<span class="topic topic-music">debussy\'s arabesque no. 1</span>'));
  assert.ok(html.includes('<span class="topic topic-reading"><a href="https://dataintensive.net/">the boar book</a></span>'));
});
