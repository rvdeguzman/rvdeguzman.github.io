"use client";

import dynamic from "next/dynamic";

const TorusKnotCanvas = dynamic(() => import("./TorusKnotCanvas"), {
    ssr: false,
    loading: () => <div className="h-80 w-full max-w-2xl mx-auto bg-black rounded flex items-center justify-right text-gray-500">Loading...</div>
});

export default function TorusKnotWrapper() {
    return <TorusKnotCanvas />;
}
