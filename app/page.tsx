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
  const [greeting, setGreeting] = useState("hi");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("good afternoon");
    } else if (hour >= 18 && hour < 22) {
      setGreeting("good evening");
    } else {
      setGreeting("hi");
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

      <div className="flex flex-col items-start justify-center h-[400px] w-full max-w-4xl mx-auto">
        <h1 className="text-gruvbox-fg text-4xl font-bold mb-4">
          {greeting}, i'm rafael vincent
        </h1>
        <p className="text-gruvbox-fg max-w-2xl">
          i am a computer science student at concordia university, with a
          passion for software development. i am currently working as a mobile
          developer.
        </p>
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
          <h2 className="text-gruvbox-fg text-4xl font-bold mb-6">education</h2>
          <ul className="text-gruvbox-fg max-w-2xl space-y-4">
            <li className="flex flex-col">
              <span className="font-bold text-lg">
                B.CompSc - Concordia University
              </span>
              <span className="text-gruvbox-fg text-sm mt-1">
                Computer Science
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg">
                DEC / Associate's Degree - John Abbott College
              </span>
              <span className="text-gruvbox-fg text-sm mt-1">
                Computer Science
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
            work experience
          </h2>
          <ul className="text-gruvbox-fg max-w-2xl space-y-4 text-right">
            <li className="flex flex-col">
              <span className="font-bold text-lg">Acculete</span>
              <span className="text-gruvbox-fg text-sm mt-1">
                Mobile App Developer
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg">Chargehub</span>
              <span className="text-gruvbox-fg text-sm mt-1">
                Software Developer Intern
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
          <h2 className="text-gruvbox-fg text-4xl font-bold mb-6">projects</h2>
          <ul className="text-gruvbox-fg max-w-2xl space-y-4">
            <li className="flex flex-col">
              <span className="font-bold text-lg">Cat Trader</span>
              <span className="text-gruvbox-fg text-sm mt-1">
                Tinder-like cat swiping app
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg">Fantasy Survivors</span>
              <span className="text-gruvbox-fg text-sm mt-1">
                Top-down bullet hell game
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg">Bananabank</span>
              <span className="text-gruvbox-fg text-sm mt-1">
                .NET Maui application for managing personal finances
              </span>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-lg">Cropbox</span>
              <span className="text-gruvbox-fg text-sm mt-1">
                Full stack android application for managing an automated green
                house
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
