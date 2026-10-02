import { about, now, posts, projects, experience, education, nav } from "./data";
import TextModelWrapper from "../../components/TextModelWrapper";
import ThemeToggle from "./ThemeToggle";

/* Variant 4 — Readme. Axis: documentation as identity — the page is a
   personal README.md: markdown headers, task-list now-section, fenced
   preview for the orbs. */

export default function Readme() {
    let d = 0;
    const rise = () => ({ animation: `pr-rise 0.26s ease-out ${(d += 0.05)}s both` });

    return (
        <div className="pr-readme">
            <header style={rise()}>
                <h1 className="pr-h1">raf de guzman</h1>
                <p className="pr-sub">
                    <code>cs @ concordia</code> <code>montréal</code> <code>calm tools enjoyer</code>
                </p>
                <nav className="pr-nav">
                    {nav.map((n) => (
                        <span key={n.label}><a href={n.href}>[{n.label}]</a>{" "}</span>
                    ))}
                    <ThemeToggle className="px-theme" />
                </nav>
            </header>

            <section style={rise()}>
                <h2 className="pr-h2">## about</h2>
                <div className="pr-about">
                    <p className="pr-body">{about.body}</p>
                    <figure className="pr-preview">
                        <TextModelWrapper size={140} />
                        <figcaption>orbs.ascii — renders best in the dark</figcaption>
                    </figure>
                </div>
            </section>

            <section style={rise()}>
                <h2 className="pr-h2">## now</h2>
                <ul className="pr-tasks">
                    {now.items.map((item) => <li key={item}>[x] {item}</li>)}
                    <li className="pr-todo">[ ] finishing this site redesign</li>
                </ul>
                <p className="pr-meta">last commit: {now.updated}</p>
            </section>

            <section style={rise()}>
                <h2 className="pr-h2">## writing</h2>
                <ul className="pr-list">
                    {posts.map((p) => (
                        <li key={p.title}>
                            <a href={p.href}>- {p.title.toLowerCase()}</a>
                            <span className="pr-meta"> — {p.description.toLowerCase()}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section style={rise()}>
                <h2 className="pr-h2">## projects</h2>
                <ul className="pr-list">
                    {projects.map((p) => (
                        <li key={p.title}>
                            <a href={p.href}>- <strong>{p.title.toLowerCase()}</strong></a>
                            <span className="pr-meta"> — {p.description} ({p.tags.join(", ").toLowerCase()})</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section style={rise()}>
                <h2 className="pr-h2">## experience</h2>
                <ul className="pr-list">
                    {experience.map((e, i) => (
                        <li key={i}>
                            - {e.role.toLowerCase()} @ {e.company.toLowerCase()}
                            <span className="pr-meta"> ({e.date.toLowerCase()})</span>
                        </li>
                    ))}
                </ul>
                <h2 className="pr-h2 pr-h2-sub">## education</h2>
                <ul className="pr-list">
                    {education.map((e) => (
                        <li key={e.school}>
                            - {e.degree.toLowerCase()}, {e.school.toLowerCase()}
                            <span className="pr-meta"> ({e.date.toLowerCase()})</span>
                        </li>
                    ))}
                </ul>
            </section>

            <footer className="pr-foot" style={rise()}>
                <code>mit license · prs welcome</code>
            </footer>
        </div>
    );
}
