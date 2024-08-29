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
      <div className="relative flex flex-col items-center justify-center h-[400px]">
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

      <div className="flex flex-col items-start justify-center h-[250px] w-full max-w-4xl mx-auto">
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

        <span className="text-gruvbox-fg-darker text-xs w-full break-words mt-2">
          📷 • 🎸 • 🎮
        </span>
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
                Cross platform mobile application to interface with Acculete
                devices.
              </span>
              <span className="text-gruvbox-fg-darker text-xs mt-1 w-full break-words">
                {" "}
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
                Ambient sound mixer for customized study environments
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
