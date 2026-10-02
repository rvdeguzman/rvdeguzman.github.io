import { about, now, posts, projects, experience, education, nav } from "./data";
import TextModelWrapper from "../../components/TextModelWrapper";
import ThemeToggle from "./ThemeToggle";

/* Variant 3 — Garden. Axis: digital garden — wikilinks, note maturity,
   dashed "beds", a winding path instead of a resume. Homey and personal:
   first-person asides, nothing labeled like a CV. */

const maturity = ["evergreen", "budding", "seedling"];

export default function Garden() {
    let d = 0;
    const rise = () => ({ animation: `pg-rise 0.32s ease-out ${(d += 0.06)}s both` });

    return (
        <div className="pg-garden">
            <header className="pg-masthead" style={rise()}>
                <div className="pg-name">raf&rsquo;s garden</div>
                <div className="pg-tagline">hi — this is my corner of the web. i study cs at concordia and live in montréal.</div>
                <nav className="pg-nav">
                    {nav.map((n) => (
                        <a key={n.label} href={n.href} className="pg-wiki">{n.label}</a>
                    ))}
                    <ThemeToggle className="px-theme" />
                </nav>
            </header>

            <section className="pg-bed" style={rise()}>
                <div className="pg-welcome">
                    <div>
                        <p className="pg-greeting">welcome in, make yourself at home.</p>
                        <p className="pg-body">{about.body}</p>
                        <p className="pg-aside">(the orbs are mine. they follow the light — try the theme switch.)</p>
                    </div>
                    <div className="pg-orbs">
                        <TextModelWrapper size={150} />
                    </div>
                </div>
            </section>

            <section style={rise()}>
                <h2 className="pg-label">these days i&rsquo;m…</h2>
                <ul className="pg-list">
                    {now.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="pg-aside">last updated {now.updated}, probably on a sunday</div>
            </section>

            <section style={rise()}>
                <h2 className="pg-label">things i&rsquo;ve written down</h2>
                {posts.map((p, i) => (
                    <div key={p.title} className="pg-note">
                        <a href={p.href} className="pg-wiki">{p.title.toLowerCase()}</a>
                        <span className="pg-meta">{p.description.toLowerCase()} · still {maturity[i % maturity.length]}</span>
                    </div>
                ))}
                <div className="pg-aside">fair warning: i write about keyboards more than any person should</div>
            </section>

            <section style={rise()}>
                <h2 className="pg-label">stuff i&rsquo;m growing</h2>
                <div className="pg-grid">
                    {projects.map((p) => (
                        <a key={p.title} href={p.href} className="pg-bed pg-plot">
                            <div className="pg-plot-title">{p.title.toLowerCase()}</div>
                            <div className="pg-plot-desc">{p.description}</div>
                            <div className="pg-meta">{p.tags.join(" · ").toLowerCase()}</div>
                        </a>
                    ))}
                </div>
            </section>

            <section style={rise()}>
                <h2 className="pg-label">how i got here</h2>
                <div className="pg-path">
                    {[...experience.map((e) => ({ date: e.date, what: `${e.role.toLowerCase()} at ${e.company.toLowerCase()}` })),
                      ...education.map((e) => ({ date: e.date.split(" – ")[0], what: `${e.degree.toLowerCase()}, ${e.school.toLowerCase()}` }))]
                        .map((p, i) => (
                            <div key={i} className="pg-stop">
                                <span className="pg-meta">{p.date.toLowerCase()}</span> — {p.what}
                            </div>
                        ))}
                </div>
            </section>

            <footer className="pg-foot" style={rise()}>
                thanks for wandering through — come back whenever
            </footer>
        </div>
    );
}
