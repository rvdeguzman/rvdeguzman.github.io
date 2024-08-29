"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useInView } from "../hooks/useInView";

// Dynamically import the SpinningModel component with SSR disabled
const SpinningModel = dynamic(() => import("../components/SpinningModel"), {
  ssr: false,
});

export default function Home() {
  const [greeting, setGreeting] = useState("Hi");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("Good evening");
    } else {
      setGreeting("Hello");
    }
  }, []);

  const [educationRef, educationInView] = useInView({ threshold: 0.1 }) as [
    React.RefObject<HTMLDivElement>,
    boolean
  ];
  const [workRef, workInView] = useInView({ threshold: 0.1 }) as [
    React.RefObject<HTMLDivElement>,
    boolean
  ];
  const [projectsRef, projectsInView] = useInView({ threshold: 0.1 }) as [
    React.RefObject<HTMLDivElement>,
    boolean
  ];

  const [animationsPlayed, setAnimationsPlayed] = useState({
    education: false,
    work: false,
    projects: false,
  });

  useEffect(() => {
    if (workInView && !animationsPlayed.work) {
      setAnimationsPlayed((prev) => ({ ...prev, work: true }));
    }
    if (educationInView && !animationsPlayed.education) {
      setAnimationsPlayed((prev) => ({ ...prev, education: true }));
    }
    if (projectsInView && !animationsPlayed.projects) {
      setAnimationsPlayed((prev) => ({ ...prev, projects: true }));
    }
  }, [workInView, educationInView, projectsInView]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* Spinning model section */}
      <div className="relative flex flex-col items-center justify-center h-[300px] mb-12">
        <div
          className="absolute z-10 w-full max-w-md mx-auto"
          style={{ top: "60%" }}
        >
          <div className="bg-gruvbox-yellow text-black p-4 rounded-md shadow-md text-center">
            <p className="font-bold text-gruvbox-bg">
              🚧 This site is currently under construction 🚧
            </p>
          </div>
        </div>
        <div className="z-0">
          <SpinningModel />
        </div>
        <div className="bottom-0 left-0 p-4">
          <p className="text-gruvbox-fg">we will be back shortly - rv</p>
        </div>
      </div>

      {/* Sticky note section */}
      <div className="absolute top-24 right-24 max-w-xs z-10">
        <div className="bg-gruvbox-yellow text-gruvbox-bg p-4 rounded-md shadow-md transform rotate-2">
          <p className="font-bold text-sm mb-2">📌 todos:</p>
          <p className="text-xs">
            - add photos for projects <br />- add more 3d models, and
            interactivity???? <br />- add blog section (?) <br />- add gear
            section <br />- add resume <br />- add contact info
          </p>
        </div>
      </div>

      {/* Introduction section */}
      <div className="flex flex-col items-start justify-center w-full max-w-4xl mx-auto mb-24 mt-16">
        <h1 className="text-gruvbox-fg text-4xl font-bold mb-4">
          {greeting}, I'm Rafael Vincent,
        </h1>
        <p className="text-gruvbox-fg-dark text-sm max-w-[50%] leading-relaxed mb-2">
          Computer Science student at Concordia University interested in
          applications of AI to solve real-world problems.
        </p>
        <span className="text-gruvbox-fg-darker text-xs w-full break-words">
          I am passionate about performance and learning how to build better
          software.
        </span>

        {/* LinkedIn and GitHub icons */}
        <div className="flex space-x-2 mt-4">
          <a
            href="https://www.linkedin.com/in/rafdeguzman/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gruvbox-fg hover:text-gruvbox-blue transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/rafdeguzman"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gruvbox-fg hover:text-gruvbox-purple transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center w-full max-w-4xl mx-auto">
        <div
          ref={educationRef}
          className={`flex flex-col items-start w-full mb-24 transition-all duration-1000 ${
            animationsPlayed.education
              ? "opacity-100 translate-x-0"
              : educationInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
        >
          <h2 className="text-gruvbox-fg text-4xl font-bold mb-6">Education</h2>
          <ul className="text-gruvbox-fg-dark max-w-2xl space-y-4 w-full">
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                B.CompSc - Concordia University
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-words">
                Computer Science
              </span>
              <span className="text-gruvbox-fg-darker text-xs w-full break-words">
                2023 - 2027
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                DEC / Associate's Degree - John Abbott College
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-words">
                Computer Science
              </span>
              <span className="text-gruvbox-fg-darker text-xs w-full break-words">
                2020 - 2023
              </span>
            </li>
          </ul>
        </div>

        <div
          ref={workRef}
          className={`flex flex-col items-end w-full mb-24 transition-all duration-1000 ${
            animationsPlayed.work
              ? "opacity-100 translate-x-0"
              : workInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
        >
          <h2 className="text-gruvbox-fg text-4xl font-bold mb-6">
            Work Experience
          </h2>
          <ul className="text-gruvbox-fg-dark max-w-2xl space-y-4 text-right w-full">
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                Mobile App Developer -{" "}
                <a
                  href="https://acculete.com/"
                  className="inline-flex items-center"
                >
                  Acculete Inc
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-words">
                Building a cross platform mobile application to interface with
                the Acculete device.
              </span>
              <span className="text-gruvbox-fg-darker text-xs mt-1 w-full break-words">
                Flutter • Dart • Firebase
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                Full-Stack Development Intern -{" "}
                <a
                  href="https://chargehub.com/en/"
                  className="inline-flex items-center"
                >
                  ChargeHub
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-words">
                Developed data-driven B2B products for EV charging
                infrastructure.
              </span>
              <span className="text-gruvbox-fg-darker text-xs mt-1 w-full break-words">
                JS • Node • Vue • Firebase • ReTool • MSSQL • MongoDB
              </span>
            </li>
          </ul>
        </div>

        <div
          ref={projectsRef}
          className={`flex flex-col items-start w-full mb-24 transition-all duration-1000 ${
            animationsPlayed.projects
              ? "opacity-100 translate-x-0"
              : projectsInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
        >
          <h2 className="text-gruvbox-fg text-4xl font-bold mb-6">Projects</h2>
          <ul className="text-gruvbox-fg-dark max-w-2xl space-y-4 w-full">
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                StudyNoise
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-normal">
                A white noise application that allows users to layer different
                sounds to create a custom study environment.
              </span>
              <span className="text-gruvbox-fg-darker text-xs mt-1 w-full break-words">
                Dart • Flutter • Firebase
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                Fantasy Survivors
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-words">
                Bullet-hell game with a rogue-lite progression system
              </span>
              <span className="text-gruvbox-fg-darker text-xs mt-1 w-full break-words">
                {" "}
                TS • Phaser
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                Bananabank
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-words">
                Windows application for managing personal finances.
              </span>
              <span className="text-gruvbox-fg-darker text-xs mt-1 w-full break-words">
                .NET • MAUI • SQLite
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg text-gruvbox-fg w-full break-words">
                Cropbox
              </span>
              <span className="text-gruvbox-fg-dark text-sm mt-1 w-full break-words">
                Mobile greenhouse automation and monitoring system.
              </span>
              <span className="text-gruvbox-fg-darker text-xs mt-1 w-full break-words">
                Azure • Python • C# • SQLite • Raspberry Pi
              </span>
            </li>
          </ul>
        </div>
      </div>
      {/*
          models: use polypizza google models (?)
          should i add a blog section???????????????
          what about gear section?

         layout plan:
         - link to linkedin, github (X? maybe........), email?
         - link to resume...

         - about me (student at concordia university, interested in different fields of computer science)
            - B.CompSc - Concordia University: Computer Science
            - DEC / Associate's Degree - John Abbott College: Computer Science

         - work experience ** include technologies used **
            - acculete: mobile app developer july 2024 - present
            - chargehub: software developer internship may 2023 - dec 2023

         - projects
            - cat trader - tinder-like cat swiping app (probably remove this lowkey hahah)
            - fantasy survivors - top-down bullet hell in the same vein of vampire survivors
            - bananabank - .net maui application for managing personal finances
            - cropbox - full stack android application for managing an automated green house

     */}
    </main>
  );
}
