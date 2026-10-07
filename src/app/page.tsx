import Link from "next/link";
// import Orbs from "./components/Orbs";
import KoiPond from "./components/KoiPond";
import Scramble from "./components/Scramble";
import NowPlaying from "./components/NowPlaying";
import { getPosts } from "../lib/posts";
import { getProjects } from "../lib/projects";
import { getAbout } from "../lib/about";
import { getNow } from "../lib/now";
import { getPlaylist } from "../lib/playlist";
import { getExperiences } from "../lib/experiences";
import { getEducation } from "../lib/education";
import { photos } from "../lib/photos";

const socials = [
  { label: "github", badge: "[gh]", href: "https://github.com/rvdeguzman" },
  { label: "linkedin", badge: "[in]", href: "https://linkedin.com/in/rvdeguzman" },
  { label: "x", badge: "[x]", href: "https://x.com/rxf_twt" },
];

function Label({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <h2 className="label">
      <span>{children}</span>
      <span className="label-rule" aria-hidden="true" />
      {note && <span className="label-note">{note}</span>}
    </h2>
  );
}

// A nod to home: hovering "montréal" decodes it into the route that got me here.
const CITY = "montréal";
function withHometown(text: string) {
  const at = text.indexOf(CITY);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <Scramble from={CITY} to="mnl 2 mtl" label="montréal, by way of manila" />
      {text.slice(at + CITY.length)}
    </>
  );
}

// Same trick for the name: hovering the initials decodes them into the full thing.
const INITIALS = "rv";
function withName(text: string) {
  const at = text.lastIndexOf(INITIALS);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <Scramble from={INITIALS} to="rafael vincent" label="rafael vincent" fit />
      {text.slice(at + INITIALS.length)}
    </>
  );
}

export default async function Home() {
  const about = getAbout();
  const now = getNow();
  const experiences = getExperiences();
  const education = getEducation();
  const posts = getPosts();
  const projects = getProjects();
  const tracks = now?.playlist ? await getPlaylist(now.playlist) : [];

  const paragraphs = (about?.content ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  const nowItems = now?.summary ?? [];

  let i = 1;
  const rise = () => ({ "--i": i++ }) as React.CSSProperties;

  return (
    <main>
      <section className="hero">
        <h1 className="hello rise" style={rise()}>{withName(about?.title ?? "it's rv")}.</h1>
        <div>
          {about?.description && (
            <p className="where rise" style={rise()}>
              <span>{withHometown(about.description)}</span>
              <span className="label-rule" aria-hidden="true" />
            </p>
          )}
          {paragraphs.map((p, n) => (
            <p key={n} className={`${n === 0 ? "lede" : "body"} rise`} style={rise()}>{p}</p>
          ))}
          <p className="links rise" style={rise()}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
              >
                {s.badge}
              </a>
            ))}
          </p>
        </div>
        {/* Orbs are paused for now; keep the component available to restore.
                <div className="rise" style={rise()}>
                    <Orbs />
                </div>
                */}
        {nowItems.length > 0 && (
          <section className="hero-now rise" style={rise()} aria-label="now">
            <Label note={now?.updated ? `updated ${now.updated}` : undefined}>
              <Link href="/now" className="label-link">now</Link>
            </Label>
            <ul className="now">
              {nowItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {tracks.length > 0 && <NowPlaying tracks={tracks} />}
          </section>
        )}
      </section>

      <section className="rise" style={rise()} aria-label="koi pond">
        <KoiPond />
      </section>

      <section className="section rise" style={rise()}>
        <Label note="scroll →">flicks</Label>
        <div className="roll" tabIndex={0} aria-label="photos">
          {photos.map((p, n) => (
            <figure key={p.src} className="plate">
              <div className="plate-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" style={{ objectPosition: p.objectPosition }} />
              </div>
              <figcaption>
                <span className="num plate-no">pl. {String(n + 1).padStart(2, "0")}</span>
                <span className="plate-title">{p.title}</span>
                <span className="plate-note">{p.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section rise" style={rise()}>
        <Label>posts</Label>
        <div className="rows">
          {posts.map((p) => (
            <Link key={p.slug} href={`/posts/${p.slug}`} className="row">
              <span className="row-title">{p.title.toLowerCase()}</span>
              <span className="row-desc">{p.description.toLowerCase()}</span>
              <span className="row-meta num">{p.date}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section rise" style={rise()}>
        <Label>projects</Label>
        <div className="rows">
          {projects.map((p) => {
            const inner = (
              <>
                <span className="row-title">{p.title.toLowerCase()}</span>
                <span className="row-desc">{p.description.toLowerCase()}</span>
                <span className="row-meta">{p.tags.join(" · ").toLowerCase()}</span>
              </>
            );
            if (p.page) {
              return <Link key={p.slug} href={`/projects/${p.slug}`} className="row">{inner}</Link>;
            }
            return p.url ? (
              <a key={p.slug} href={p.url} className="row" target="_blank" rel="noopener noreferrer">{inner}</a>
            ) : (
              <div key={p.slug} className="row">{inner}</div>
            );
          })}
        </div>
      </section>

      <section className="section cols rise" style={rise()}>
        <div>
          <Label>work</Label>
          <dl className="ledger">
            {experiences.map((e) => (
              <div key={e.slug}>
                <dt className="num">{e.dates}</dt>
                <dd>{e.role.toLowerCase()} <span>@ {e.company.toLowerCase()}</span></dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <Label>school</Label>
          <dl className="ledger">
            {education.map((e) => (
              <div key={e.slug}>
                <dt className="num">{e.dates}</dt>
                <dd>{e.school.toLowerCase()} <span>{e.degree.toLowerCase()}</span></dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
