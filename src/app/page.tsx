import Header from "./header";
import Separator from "./components/Separator";
import AboutSection from "./components/AboutSection";
import ExperienceSection from "./components/ExperienceSection";
import EducationSection from "./components/EducationSection";
import ProjectCard from "./components/ProjectCard";
import PostsSection from "./components/PostsSection";
import { getPosts } from "../lib/posts";
import { getProjects } from "../lib/projects";
import { getAbout } from "../lib/about";
import { getExperiences } from "../lib/experiences";
import { getEducation } from "../lib/education";

const slideIn = (delay: number) => ({
    animation: `ps2-slide-in 0.4s ease ${delay}s both`,
});

export default function Home() {
    const about = getAbout();
    const experiences = getExperiences();
    const education = getEducation();
    const posts = getPosts();
    const projects = getProjects();

    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-3xl mx-auto px-8 py-8 pt-0">
                <div className="ps2-glass p-6 md:p-8 space-y-8">
                    <div style={slideIn(0)} className="mb-0">
                        <AboutSection about={about} />
                    </div>
                    <div style={slideIn(0.08)}>
                        <Separator />
                    </div>

                    <div style={slideIn(0.14)}>
                        <ExperienceSection experiences={experiences} />
                    </div>
                    <div style={slideIn(0.2)}>
                        <Separator />
                    </div>

                    <div style={slideIn(0.26)}>
                        <EducationSection education={education} />
                    </div>
                    <div style={slideIn(0.32)}>
                        <Separator />
                    </div>

                    <div style={slideIn(0.38)}>
                        <ProjectCard projects={projects} />
                    </div>
                    <div style={slideIn(0.44)}>
                        <Separator />
                    </div>

                    <div style={slideIn(0.5)}>
                        <PostsSection posts={posts} />
                    </div>
                </div>
            </main>
        </div>
    );
}
