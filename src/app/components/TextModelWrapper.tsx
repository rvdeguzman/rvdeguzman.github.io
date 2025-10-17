"use client";

import dynamic from "next/dynamic";

const TextModelCanvas = dynamic(() => import("./TextModelCanvas"), {
    ssr: false,
    loading: () => <div className="h-80 w-full max-w-2xl mx-auto bg-black rounded flex items-center justify-center text-gray-500">Loading...</div>
});

export default function TextModelWrapper() {
    return <TextModelCanvas />;
}
