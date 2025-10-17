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

export default function Home() {
    const about = getAbout();
    const experiences = getExperiences();
    const education = getEducation();
    const posts = getPosts();
    const projects = getProjects();
    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-2xl mx-auto px-8 py-8 pt-0">
                <div className="space-y-8">
                    <AboutSection about={about} />
                    <Separator />

                    <ExperienceSection experiences={experiences} />
                    <Separator />

                    <EducationSection education={education} />
                    <Separator />

                    <ProjectCard projects={projects} />
                    <Separator />

                    <PostsSection posts={posts} />
                    <Separator />
                </div>
            </main>
        </div>
    );
}
