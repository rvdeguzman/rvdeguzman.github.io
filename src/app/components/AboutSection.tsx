"use client";

import TextModelWrapper from "./TextModelWrapper";
import { About } from "@/lib/about";
import { FaLinkedin, FaGithub, FaFileDownload } from "react-icons/fa";
import { color } from "three/tsl";

export default function AboutSection({ about }: { about: About | null }) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-stretch mb-0 lg:min-h-0">
            <section className="lg:w-2/3">
                {about ? (
                    <>
                        <h1 className="text-3xl font-bold about">{about.title}</h1>
                        <h2 className="text-2xl text-gray-200">{about.description}</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            {about.location} | {about.email}
                        </p>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-gray text-justify dark:prose-invert max-w-none">
                            {about.content.split('\n').map((line, idx) => (
                                line.trim() ? <p key={idx} className="mb-4">{line}</p> : null
                            ))}
                        </div>
                        <div className="flex gap-4 mb-4">
                            <a
                                href="https://linkedin.com/in/rvdeguzman"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-all duration-300 hover:text-[var(--accent1)]"
                            >
                                <FaLinkedin size={24} />
                            </a>
                            <a
                                href="https://github.com/rvdeguzman"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-all duration-300 hover:text-[var(--accent1)]"
                            >
                                <FaGithub size={24} />
                            </a>
                            <a
                                href="/rvdeguzman_cv.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-all duration-300 hover:text-[var(--accent1)]"
                            >
                                <FaFileDownload size={24} />
                            </a>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-4">About Me</h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            ...
                        </p>
                    </>
                )}
            </section>

            <div className="lg:w-1/3 mt-8 lg:mt-0">
                <TextModelWrapper />
            </div>
        </div>
    );
}
