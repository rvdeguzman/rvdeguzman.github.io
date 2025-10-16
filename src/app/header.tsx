"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const tabsData = [
    { label: "about", href: "/" },
    { label: "posts", href: "/posts" },
    { label: "misc", href: "/misc" },
];

const Header = () => {
    const [hoveredTab, setHoveredTab] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    const getCurrentTabIndex = () => {
        return tabsData.findIndex(tab => tab.href === pathname);
    };

    useEffect(() => {
        const handleKeyDown = (e: any) => {
            if (document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            // vim motionssss
            switch (e.key) {
                case 'j':
                    e.preventDefault();
                    window.scrollBy({ top: 100, behavior: 'smooth' });
                    break;
                case 'k':
                    e.preventDefault();
                    window.scrollBy({ top: -100, behavior: 'smooth' });
                    break;
                case 'h':
                    e.preventDefault();
                    const currentIndex = getCurrentTabIndex();
                    const prevIndex = currentIndex <= 0 ? tabsData.length - 1 : currentIndex - 1;
                    router.push(tabsData[prevIndex].href);
                    break;
                case 'l':
                    e.preventDefault();
                    const currentIndexL = getCurrentTabIndex();
                    const nextIndex = currentIndexL >= tabsData.length - 1 ? 0 : currentIndexL + 1;
                    router.push(tabsData[nextIndex].href);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router, pathname]);

    return (
        <div className="w-full flex flex-col justify-center px-8">
            <nav className="flex items-center justify-between w-full max-w-2xl mx-auto px-8 py-8">
                <div className="relative flex gap-4">
                    {tabsData.map((tab, idx) => (
                        <Link
                            key={idx}
                            href={tab.href}
                            className="relative text-gray-400 transition-colors duration-200"
                            style={{
                                color: hoveredTab === idx || getCurrentTabIndex() === idx ? 'var(--accent1)' : undefined,
                                fontWeight: getCurrentTabIndex() === idx ? 'bold' : undefined,
                                textDecoration: getCurrentTabIndex() === idx ? 'underline' : undefined
                            }}
                            onMouseEnter={() => setHoveredTab(idx)}
                            onMouseLeave={() => setHoveredTab(null)}
                        >
                            {tab.label}
                            {hoveredTab === idx && (
                                <span className="absolute inset-0 transition-all duration-500 -z-10" />
                            )}
                        </Link>
                    ))}
                </div>
            </nav>
        </div >
    );
};

export default Header;
