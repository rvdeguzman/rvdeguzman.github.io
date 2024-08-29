"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

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

      <div className="flex flex-col items-start justify-center h-[400px] w-full max-w-4xl mx-auto">
        <h2 className="text-gruvbox-fg text-4xl font-bold mb-4">education</h2>
        <ul className="text-gruvbox-fg max-w-2xl">
          <li>
            <span className="font-bold">B.CompSc - Concordia University:</span>
            <span className="text-gruvbox-fg text-sm font-normal">
              Computer Science
            </span>
          </li>
          <li>
            <span className="font-bold">
              DEC / Associate's Degree - John Abbott College:
            </span>
            <span className="text-gruvbox-fg text-sm font-normal">
              Computer Science
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-start justify-center h-[400px] w-full max-w-4xl mx-auto">
        <h2 className="text-gruvbox-fg text-4xl font-bold mb-4">
          work experience
        </h2>
        <ul className="text-gruvbox-fg max-w-2xl">
          <li>
            <span className="font-bold">Acculete:</span>
            <span className="text-gruvbox-fg text-sm font-normal">
              Mobile App Developer
            </span>
          </li>
          <li>
            <span className="font-bold">Chargehub:</span>
            <span className="text-gruvbox-fg text-sm font-normal">
              Software Developer Intern
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-start justify-center h-[400px] w-full max-w-4xl mx-auto">
        <h2 className="text-gruvbox-fg text-4xl font-bold mb-4">projects</h2>
        <ul className="text-gruvbox-fg max-w-2xl">
          <li>
            <span className="font-bold">Cat Trader:</span>
            <span className="text-gruvbox-fg text-sm font-normal">
              Tinder-like cat swiping app
            </span>
          </li>
          <li>
            <span className="font-bold">Fantasy Survivors:</span>
            <span className="text-gruvbox-fg text-sm font-normal">
              Top-down bullet hell game
            </span>
          </li>
          <li>
            <span className="font-bold">Bananabank:</span>
            <span className="text-gruvbox-fg text-sm font-normal">
              .NET Maui application for managing personal finances
            </span>
          </li>
          <li>
            <span className="font-bold">Cropbox:</span>
            <span className="text-gruvbox-fg text-sm font-normal">
              Full stack android application for managing an automated green
              house
            </span>
          </li>
        </ul>
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
