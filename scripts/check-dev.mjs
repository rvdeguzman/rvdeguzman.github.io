// Check the actual chunk URLs emitted by the running server, not just HTTP 200
// for its HTML. A build overwriting dev output leaves HTML healthy but JS 404s.
const base = process.env.DEV_URL ?? "http://localhost:3000";

async function request(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`${response.status} ${url}`);
    return response;
}

try {
    for (const path of ["/", "/posts/"]) {
        const pageUrl = new URL(path, base);
        const html = await (await request(pageUrl)).text();
        const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)]
            .map((match) => new URL(match[1].replaceAll("&amp;", "&"), pageUrl));
        if (!scripts.length) throw new Error(`No script chunks in ${pageUrl}`);
        await Promise.all(scripts.map(async (url) => {
            const response = await request(url);
            if (!response.headers.get("content-type")?.includes("javascript")) {
                throw new Error(`Expected JavaScript from ${url}`);
            }
            // Consume the body so this also checks that each chunk finishes loading.
            await response.arrayBuffer();
        }));
        console.log(`PASS ${path}: HTML and ${scripts.length} JavaScript chunks`);
    }
} catch (error) {
    console.error(`FAIL: ${error.message}`);
    process.exitCode = 1;
}
