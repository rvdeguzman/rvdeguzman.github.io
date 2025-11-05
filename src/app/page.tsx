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

const fadeInStyle = (delay: number) => ({
    animation: `fadeIn 0.6s ease-in-out ${delay}s both`,
});

export default function Home() {
    const about = getAbout();
    const experiences = getExperiences();
    const education = getEducation();
    const posts = getPosts();
    const projects = getProjects();

    return (
        <div className="min-h-screen">
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
            <Header />
            <main className="max-w-3xl mx-auto px-8 py-8 pt-0">
                <div className="space-y-8">
                    <div style={fadeInStyle(0)} className="mb-0">
                        <AboutSection about={about} />
                    </div>
                    <div style={fadeInStyle(0.1)}>
                        <Separator />
                    </div>

                    <div style={fadeInStyle(0.2)}>
                        <ExperienceSection experiences={experiences} />
                    </div>
                    <div style={fadeInStyle(0.3)}>
                        <Separator />
                    </div>

                    <div style={fadeInStyle(0.4)}>
                        <EducationSection education={education} />
                    </div>
                    <div style={fadeInStyle(0.5)}>
                        <Separator />
                    </div>

                    <div style={fadeInStyle(0.6)}>
                        <ProjectCard projects={projects} />
                    </div>
                    <div style={fadeInStyle(0.7)}>
                        <Separator />
                    </div>

                    <div style={fadeInStyle(0.8)}>
                        <PostsSection posts={posts} />
                    </div>
                    <div style={fadeInStyle(0.9)}>
                        <Separator />
                    </div>
                </div>
            </main>
        </div>
    );
}
