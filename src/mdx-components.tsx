import type { MDXComponents } from "mdx/types";
import ClockOrbs from "./app/components/ClockOrbs";
import KoiPond from "./app/components/KoiPond";

// Components listed here are usable in any .mdx post without an import,
// e.g. <ClockOrbs />. Override Markdown elements here too (img, a, pre, ...).
const components: MDXComponents = {
    ClockOrbs,
    KoiPond,
};

export function useMDXComponents(): MDXComponents {
    return components;
}
