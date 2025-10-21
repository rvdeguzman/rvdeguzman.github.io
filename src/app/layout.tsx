import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning={true}
            >
                <ThemeProvider enableSystem={false} attribute="class">
                    <main className="min-h-screen bg-white dark:bg-black bg-[radial-gradient(#222222_1px,transparent_1px)] dark:bg-[radial-gradient(#222222_1px,transparent_1px)] [background-size:32px_32px]">
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
