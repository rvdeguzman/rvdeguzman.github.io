import { about, now, posts, projects, experience, education } from "./data";
import TextModelWrapper from "../../components/TextModelWrapper";
import ThemeToggle from "./ThemeToggle";

/* Variant 2 — Terminal. Axis: interaction metaphor — the page reads as a
   shell transcript: prompts, cat/ls commands, output, blinking cursor. */

function Prompt({ cmd, d }: { cmd: string; d: number }) {
    return (
        <div className="pt-line" style={{ animationDelay: `${d}s` }}>
            <span className="pt-user">raf@mtl</span>
            <span className="pt-path"> ~ </span>
            <span className="pt-dollar">$ </span>
            <span className="pt-cmd">{cmd}</span>
        </div>
    );
}

function Out({ children, d }: { children: React.ReactNode; d: number }) {
    return (
        <div className="pt-line pt-out" style={{ animationDelay: `${d}s` }}>
            {children}
        </div>
    );
}

export default function Terminal() {
    let d = 0;
    const step = (n = 1) => { const v = d; d += 0.055 * n; return v; };

    return (
        <div className="pt-term">
            <ThemeToggle className="px-theme pt-theme" />
            <Prompt cmd="whoami" d={step()} />
            <Out d={step()}>{about.greeting} — {about.tagline}</Out>
            <Out d={step(2)}>&nbsp;</Out>

            <Prompt cmd="cat about.md" d={step()} />
            <Out d={step()}>{about.body}</Out>
            <Out d={step(2)}>&nbsp;</Out>

            <Prompt cmd="./orbs --ascii" d={step()} />
            <Out d={step(2)}>
                <span className="pt-orbs"><TextModelWrapper size={230} /></span>
            </Out>

            <Prompt cmd="cat now.txt" d={step()} />
            <Out d={step()}><span className="pt-comment"># updated {now.updated}</span></Out>
            {now.items.map((item) => (
                <Out key={item} d={step()}>- {item}</Out>
            ))}
            <Out d={step(2)}>&nbsp;</Out>

            <Prompt cmd="ls -l posts/" d={step()} />
            <Out d={step()}><span className="pt-comment">total {posts.length}</span></Out>
            {posts.map((p) => (
                <Out key={p.title} d={step()}>
                    <span className="pt-dim">{p.date}</span>{"  "}
                    <a href={p.href} className="pt-link">{p.title.toLowerCase().replace(/ /g, "-")}.md</a>
                </Out>
            ))}
            <Out d={step(2)}>&nbsp;</Out>

            <Prompt cmd="ls projects/" d={step()} />
            {projects.map((p) => (
                <Out key={p.title} d={step()}>
                    <a href={p.href} className="pt-link">{p.title.toLowerCase()}/</a>
                    <span className="pt-dim">{"  "}— {p.description}</span>
                </Out>
            ))}
            <Out d={step(2)}>&nbsp;</Out>

            <Prompt cmd="cat resume.txt" d={step()} />
            <Out d={step()}><span className="pt-comment"># experience</span></Out>
            {experience.map((e, i) => (
                <Out key={i} d={step()}>
                    <span className="pt-dim">[{e.date.toLowerCase()}]</span> {e.role.toLowerCase()} <span className="pt-dim">@ {e.company.toLowerCase()}</span>
                </Out>
            ))}
            <Out d={step()}>&nbsp;</Out>
            <Out d={step()}><span className="pt-comment"># education</span></Out>
            {education.map((e) => (
                <Out key={e.school} d={step()}>
                    <span className="pt-dim">[{e.date.toLowerCase()}]</span> {e.degree.toLowerCase()} <span className="pt-dim">@ {e.school.toLowerCase()}</span>
                </Out>
            ))}
            <Out d={step(2)}>&nbsp;</Out>

            <div className="pt-line" style={{ animationDelay: `${step()}s` }}>
                <span className="pt-user">raf@mtl</span>
                <span className="pt-path"> ~ </span>
                <span className="pt-dollar">$ </span>
                <span className="pt-cursor" aria-hidden="true" />
            </div>
        </div>
    );
}
