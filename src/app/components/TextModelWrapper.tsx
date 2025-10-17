"use client";

import dynamic from "next/dynamic";

const TextModelCanvas = dynamic(() => import("./TextModelCanvas"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-black rounded flex items-center justify-center text-gray-500 min-h-0">Loading...</div>
});

export default function TextModelWrapper() {
    return (
        <div className="h-full w-full min-h-0">
            <TextModelCanvas />
        </div>
    );
}
