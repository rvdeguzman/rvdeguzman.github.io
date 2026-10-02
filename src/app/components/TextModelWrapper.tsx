"use client";

import dynamic from "next/dynamic";
import Loading from "./Loading";

const TextModelCanvas = dynamic(() => import("./TextModelCanvas"), {
    ssr: false,
    loading: () => <Loading />
});

export default function TextModelWrapper({ size = 270 }: { size?: number }) {
    return (
        <div style={{ width: size, height: size }}>
            <TextModelCanvas />
        </div>
    );
}
