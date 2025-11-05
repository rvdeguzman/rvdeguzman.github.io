import Header from "../header";
import ExperienceSection from "../components/ExperienceSection.tsx";
import Separator from "../components/Separator";
import EducationSection from "../components/EducationSection.tsx";
import { getExperiences } from "../../lib/experiences.ts";
import { getEducation } from "../../lib/education";


const fadeInStyle = (delay: number) => ({
    animation: `fadeIn 0.6s ease-in-out ${delay}s both`,
});

export default function Experiences() {
const experiences = getExperiences();
    const education = getEducation();

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
            <main className="max-w-2xl mx-auto px-8 py-8 pt-0">
                <div style={fadeInStyle(0)}>
                    <h1 className="text-3xl font-bold mb-4">Experience</h1>
                </div>
                <div className="space-y-8">
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

                    <section style={fadeInStyle(0.1)}>
                        <h2 className="text-2xl font-medium">Lorem Ipsum</h2>
                        <div className="space-y-2 text-sm text-gray-400 mt-1 mb-2">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        </div>
                    </section>
                    <section style={fadeInStyle(0.2)}>
                        <h2 className="text-2xl font-medium">Lorem Ipsum</h2>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        </div>
                    </section>
                    <section style={fadeInStyle(0.3)}>
                        <h2 className="text-2xl font-medium">Lorem Ipsum</h2>
                        <div className="space-y-2 text-sm text-gray-400">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}
