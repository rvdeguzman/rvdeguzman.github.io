"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamically import the SpinningModel component with SSR disabled
const SpinningModel = dynamic(() => import("../components/SpinningModel"), {
  ssr: false,
});

export default function Home() {
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
    </main>
  );
}
