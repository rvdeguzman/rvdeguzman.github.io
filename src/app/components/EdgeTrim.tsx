import type { ReactNode } from "react";

/* Captions interrupt the rail at one end. The bottom mirrors the top,
   keeping the square opposite the caption. Only the geometry is hidden. */
export default function EdgeTrim({ edge, children }: { edge: "top" | "bottom"; children: ReactNode }) {
    return (
        <div className={`edge-trim edge-trim--${edge}`}>
            <span className="edge-trim-caption">{children}</span>
            <span className="edge-trim-rule" aria-hidden="true" />
            <span className="edge-trim-segment" aria-hidden="true" />
            <span className="edge-trim-segment edge-trim-segment--short" aria-hidden="true" />
            <span className="edge-trim-square" aria-hidden="true" />
        </div>
    );
}
