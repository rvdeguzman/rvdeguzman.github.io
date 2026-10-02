import { now, posts, projects, education, nav } from "./data";
import TextModelWrapper from "../../components/TextModelWrapper";
import ThemeToggle from "./ThemeToggle";

/* Variant 5 — Changelog. Axis: life as releases — keep-a-changelog format
   for a person. Now = [unreleased], history = versioned releases,
   projects = artifacts. Personality lives in the release notes. */

export default function Changelog() {
    let d = 0;
    const rise = () => ({ animation: `pc-rise 0.26s ease-out ${(d += 0.05)}s both` });

    return (
        <div className="pc-log">
            <header style={rise()}>
                <div className="pc-title-row">
                    <div>
                        <h1 className="pc-h1">changelog</h1>
                        <p className="pc-tag">all notable changes to this person are documented here.</p>
                        <nav className="pc-nav">
                            {nav.map((n) => (
                                <a key={n.label} href={n.href}>{n.label}</a>
                            ))}
                            <ThemeToggle className="px-theme" />
                        </nav>
                    </div>
                    <figure className="pc-build">
                        <TextModelWrapper size={110} />
                        <figcaption>current build</figcaption>
                    </figure>
                </div>
            </header>

            <section style={rise()}>
                <h2 className="pc-ver">[unreleased] <span className="pc-when">— {now.updated}</span></h2>
                <h3 className="pc-kind pc-added">### working on</h3>
                <ul className="pc-list">
                    {now.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
            </section>

            <section style={rise()}>
                <h2 className="pc-ver">[2025.09] <span className="pc-when">— fall 2025</span></h2>
                <h3 className="pc-kind pc-added">### added</h3>
                <ul className="pc-list">
                    <li>software developer i @ intact</li>
                    <li>full stack research assistant @ université de montréal (w2025)</li>
                    <li>director of development @ ieee concordia (w2025)</li>
                </ul>
                <h3 className="pc-kind pc-changed">### changed</h3>
                <ul className="pc-list">
                    <li>this website, again — paper theme, personal tone, less cv-like</li>
                </ul>
            </section>

            <section style={rise()}>
                <h2 className="pc-ver">[2024.06] <span className="pc-when">— summer 2024</span></h2>
                <h3 className="pc-kind pc-added">### added</h3>
                <ul className="pc-list">
                    <li>software developer @ acculete inc.</li>
                </ul>
            </section>

            <section style={rise()}>
                <h2 className="pc-ver">[2023.01] <span className="pc-when">— winter 2023</span></h2>
                <h3 className="pc-kind pc-added">### added</h3>
                <ul className="pc-list">
                    <li>software developer intern @ chargehub</li>
                </ul>
                <h3 className="pc-kind pc-added">### started</h3>
                <ul className="pc-list">
                    {education.map((e) => (
                        <li key={e.school}>{e.degree.toLowerCase()}, {e.school.toLowerCase()} ({e.date.toLowerCase()})</li>
                    ))}
                </ul>
            </section>

            <section style={rise()}>
                <h2 className="pc-ver">## artifacts</h2>
                <ul className="pc-list">
                    {projects.map((p) => (
                        <li key={p.title}>
                            <a href={p.href} className="pc-link">{p.title.toLowerCase()}</a>
                            <span className="pc-meta"> — {p.description}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section style={rise()}>
                <h2 className="pc-ver">## release notes</h2>
                <ul className="pc-list">
                    {posts.map((p) => (
                        <li key={p.title}>
                            <a href={p.href} className="pc-link">{p.title.toLowerCase()}</a>
                            <span className="pc-meta"> — {p.description.toLowerCase()}, {p.date}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <footer className="pc-foot" style={rise()}>
                format loosely based on keep a changelog · this person follows semver when convenient
            </footer>
        </div>
    );
}
