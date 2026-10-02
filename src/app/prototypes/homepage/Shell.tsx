import { about, now, posts, projects, experience, education, socials, nav } from "./data";
import TextModelWrapper from "../../components/TextModelWrapper";
import ThemeToggle from "./ThemeToggle";

/* Variant 6 — Shell. Axis: hybrid — terminal prompts as section headings,
   paper-set content beneath them. A session that renders formatted output. */

function Prompt({ cmd, note }: { cmd: string; note?: string }) {
    return (
        <h2 className="ps-prompt">
            <span className="ps-user">raf@mtl</span>
            <span className="ps-path"> ~ </span>
            <span className="ps-dollar">$ </span>
            <span className="ps-cmd">{cmd}</span>
            {note && <span className="ps-note">  # {note}</span>}
        </h2>
    );
}

export default function Shell() {
    let d = 0;
    const rise = () => ({ animation: `ps-rise 0.28s ease-out ${(d += 0.05)}s both` });

    return (
        <div className="ps-shell">
            <header style={rise()}>
                <Prompt cmd="whoami" />
                <div className="ps-masthead">
                    <div>
                        <div className="ps-name">raf de guzman</div>
                        <div className="ps-tagline">{about.tagline}</div>
                    </div>
                    <nav className="ps-nav">
                        {nav.map((n) => (
                            <a key={n.label} href={n.href}>{n.label}</a>
                        ))}
                        <ThemeToggle className="px-theme" />
                    </nav>
                </div>
            </header>

            <section style={rise()}>
                <Prompt cmd="cat about.md" />
                <div className="ps-about-row">
                    <div>
                        <p className="ps-lede">{about.greeting}.</p>
                        <p className="ps-body">{about.body}</p>
                        <p className="ps-socials">
                            {socials.map((s, i) => (
                                <span key={s.label}>
                                    {i > 0 && <span className="ps-sep">·</span>}
                                    <a href={s.href}>{s.label}</a>
                                </span>
                            ))}
                        </p>
                    </div>
                    <div className="ps-orbs">
                        <TextModelWrapper size={260} />
                    </div>
                </div>
            </section>

            <section style={rise()}>
                <Prompt cmd="cat now.txt" note={`last watered ${now.updated}`} />
                <ul className="ps-list">
                    {now.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
            </section>

            <section style={rise()}>
                <Prompt cmd="ls writing/" />
                {posts.map((p) => (
                    <a key={p.title} href={p.href} className="ps-entry">
                        <div className="ps-entry-title">{p.title.toLowerCase()}</div>
                        <div className="ps-entry-meta">{p.description.toLowerCase()} · {p.date}</div>
                    </a>
                ))}
            </section>

            <section style={rise()}>
                <Prompt cmd="ls projects/" />
                {projects.map((p) => (
                    <a key={p.title} href={p.href} className="ps-entry">
                        <div className="ps-entry-title">{p.title.toLowerCase()}</div>
                        <div className="ps-entry-meta">{p.description} — {p.tags.join(", ").toLowerCase()}</div>
                    </a>
                ))}
            </section>

            <section style={rise()}>
                <Prompt cmd="ls experience/" />
                {experience.map((e, i) => (
                    <div key={i} className="ps-entry">
                        <div className="ps-entry-title">{e.role.toLowerCase()} <span className="ps-note">· {e.company.toLowerCase()}</span></div>
                        <div className="ps-entry-meta">{e.date.toLowerCase()} · {e.location.toLowerCase()}</div>
                    </div>
                ))}
            </section>

            <section style={rise()}>
                <Prompt cmd="ls education/" />
                {education.map((e) => (
                    <div key={e.school} className="ps-entry">
                        <div className="ps-entry-title">{e.school.toLowerCase()}</div>
                        <div className="ps-entry-meta">{e.degree.toLowerCase()} · {e.date.toLowerCase()}</div>
                    </div>
                ))}
            </section>

            <footer className="ps-foot" style={rise()}>
                <span className="ps-user">raf@mtl</span>
                <span className="ps-path"> ~ </span>
                <span className="ps-dollar">$ </span>
                <span className="ps-cursor" aria-hidden="true" />
            </footer>
        </div>
    );
}
