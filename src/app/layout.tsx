import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Header from "./header";
import EdgeTrim from "./components/EdgeTrim";
import { DEFAULT_SCHEME, SCHEME_NAMES, schemesCss } from "../lib/colorschemes";
import "./globals.css";

export const metadata: Metadata = {
    title: "rv",
    description: "rvdeguzman personal website",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <style dangerouslySetInnerHTML={{ __html: schemesCss() }} />
            </head>
            <body className="antialiased">
                <ThemeProvider
                    attribute="data-theme"
                    themes={SCHEME_NAMES}
                    defaultTheme={DEFAULT_SCHEME}
                    storageKey="site-colorscheme"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    <div className="site">
                        <div className="site-inner">
                            <Header />
                            {children}
                            <footer className="site-footer">
                                <EdgeTrim edge="bottom">mnl 2 mtl</EdgeTrim>
                            </footer>
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
