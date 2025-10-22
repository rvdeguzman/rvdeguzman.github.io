"use client";

import dynamic from "next/dynamic";
import Loading from "./Loading";

const TextModelCanvas = dynamic(() => import("./TextModelCanvas"), {
    ssr: false,
    loading: () => <Loading />
});

export default function TextModelWrapper() {
    return (
        <div className="w-[270px] h-[270px]">
            <TextModelCanvas />
        </div>
    );
}
