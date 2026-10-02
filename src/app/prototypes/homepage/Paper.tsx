import { about, now, posts, projects, experience, education, socials, nav } from "./data";
import TextModelWrapper from "../../components/TextModelWrapper";
import ThemeToggle from "./ThemeToggle";

/* Variant 1 — Paper. Axis: print metaphor, hybridized — hairline rules and
   generous whitespace (paper), path-style section headers and a masthead
   cursor (terminal), tended-garden asides (garden). */

export default function Paper() {
    let d = 0;
    const rise = () => ({ animation: `pp-rise 0.28s ease-out ${(d += 0.05)}s both` });

    return (
        <div className="pp-paper">
            <header className="pp-masthead" style={rise()}>
                <div>
                    <div className="pp-name">raf de guzman<span className="pp-cursor" aria-hidden="true" /></div>
                    <div className="pp-tagline">{about.tagline}</div>
                </div>
                <nav className="pp-nav">
                    {nav.map((n) => (
                        <a key={n.label} href={n.href}>{n.label}</a>
                    ))}
                    <ThemeToggle className="px-theme" />
                </nav>
            </header>

            <section style={rise()}>
                <h2 className="pp-label"><span className="pp-tilde">~/</span>about</h2>
                <div className="pp-about-row">
                    <div>
                        <p className="pp-lede">{about.greeting}.</p>
                        <p className="pp-body">{about.body}</p>
                        <p className="pp-socials">
                            {socials.map((s, i) => (
                                <span key={s.label}>
                                    {i > 0 && <span className="pp-sep">·</span>}
                                    <a href={s.href}>{s.label}</a>
                                </span>
                            ))}
                        </p>
                    </div>
                    <div className="pp-orbs">
                        <TextModelWrapper size={260} />
                    </div>
                </div>
            </section>

            <hr style={rise()} />

            <section style={rise()}>
                <h2 className="pp-label"><span className="pp-tilde">~/</span>now <span className="pp-note">— last watered {now.updated}</span></h2>
                <ul className="pp-list">
                    {now.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
            </section>

            <hr style={rise()} />

            <section style={rise()}>
                <h2 className="pp-label"><span className="pp-tilde">~/</span>writing</h2>
                {posts.map((p) => (
                    <a key={p.title} href={p.href} className="pp-entry">
                        <div className="pp-entry-title">{p.title.toLowerCase()}</div>
                        <div className="pp-entry-meta">{p.description.toLowerCase()} · {p.date}</div>
                    </a>
                ))}
            </section>

            <hr style={rise()} />

            <section style={rise()}>
                <h2 className="pp-label"><span className="pp-tilde">~/</span>projects</h2>
                {projects.map((p) => (
                    <a key={p.title} href={p.href} className="pp-entry">
                        <div className="pp-entry-title">{p.title.toLowerCase()}</div>
                        <div className="pp-entry-meta">{p.description} — {p.tags.join(", ").toLowerCase()}</div>
                    </a>
                ))}
            </section>

            <hr style={rise()} />

            <section style={rise()}>
                <h2 className="pp-label"><span className="pp-tilde">~/</span>experience</h2>
                {experience.map((e, i) => (
                    <div key={i} className="pp-entry">
                        <div className="pp-entry-title">{e.role.toLowerCase()} <span className="pp-note">· {e.company.toLowerCase()}</span></div>
                        <div className="pp-entry-meta">{e.date.toLowerCase()} · {e.location.toLowerCase()}</div>
                    </div>
                ))}
            </section>

            <hr style={rise()} />

            <section style={rise()}>
                <h2 className="pp-label"><span className="pp-tilde">~/</span>education</h2>
                {education.map((e) => (
                    <div key={e.school} className="pp-entry">
                        <div className="pp-entry-title">{e.school.toLowerCase()}</div>
                        <div className="pp-entry-meta">{e.degree.toLowerCase()} · {e.date.toLowerCase()}</div>
                    </div>
                ))}
            </section>

            <footer className="pp-colophon" style={rise()}>
                tended irregularly from montréal · set in iosevka
            </footer>
        </div>
    );
}
