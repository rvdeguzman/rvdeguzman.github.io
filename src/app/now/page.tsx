import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNowWithHtml } from "../../lib/now";
import { getPlaylist } from "../../lib/playlist";
import NowPlaying from "../components/NowPlaying";
import Orbs from "../components/Orbs";

export const metadata: Metadata = {
  title: "now · rv",
  description: "A little snapshot of what life looks like lately.",
};

export default async function NowPage() {
  const now = await getNowWithHtml();
  if (!now) notFound();
  const tracks = now.playlist ? await getPlaylist(now.playlist) : [];

  return (
    <main>
      <header className="post-head now-head rise" style={{ "--i": 1 } as React.CSSProperties}>
        <div>
          <h1 className="page-title">now</h1>
          {now.updated && (
            <p className="post-meta">
              <span>last updated <span className="num">{now.updated}</span></span>
            </p>
          )}
          {tracks.length > 0 && <NowPlaying tracks={tracks} />}
        </div>
        <div aria-hidden="true">
          <Orbs />
        </div>
      </header>
      <article
        className="prose rise"
        style={{ "--i": 2 } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: now.htmlContent }}
      />
    </main>
  );
}
