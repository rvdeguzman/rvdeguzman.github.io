"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const tabsData = [
    { label: "about", href: "/" },
    { label: "posts", href: "/posts" },
];

const Header = () => {
    const [hoveredTab, setHoveredTab] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const [lastKeyTime, setLastKeyTime] = useState<{ [key: string]: number }>({});

    const getCurrentTabIndex = useCallback(() => {
        let index = tabsData.findIndex((tab) => tab.href === pathname);

        if (index === -1) {
            index = tabsData.findIndex((tab) => {
                if (tab.href === "/") return false;
                return pathname.startsWith(tab.href);
            });
        }
        return index;
    }, [pathname]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            const now = Date.now();
            const lastTime = lastKeyTime[e.key] || 0;
            const debounceDelay = 150;

            if (now - lastTime < debounceDelay) {
                return;
            }

            // vim motionssss
            switch (e.key) {
                case 'j':
                    e.preventDefault();
                    window.scrollBy({ top: 100, behavior: 'smooth' });
                    setLastKeyTime(prev => ({ ...prev, [e.key]: now }));
                    break;
                case 'k':
                    e.preventDefault();
                    window.scrollBy({ top: -100, behavior: 'smooth' });
                    setLastKeyTime(prev => ({ ...prev, [e.key]: now }));
                    break;
                case 'h':
                    e.preventDefault();
                    const currentIndex = getCurrentTabIndex();
                    const prevIndex = currentIndex <= 0 ? tabsData.length - 1 : currentIndex - 1;
                    router.push(tabsData[prevIndex].href);
                    setLastKeyTime(prev => ({ ...prev, [e.key]: now }));
                    break;
                case 'l':
                    e.preventDefault();
                    const currentIndexL = getCurrentTabIndex();
                    const nextIndex = currentIndexL >= tabsData.length - 1 ? 0 : currentIndexL + 1;
                    router.push(tabsData[nextIndex].href);
                    setLastKeyTime(prev => ({ ...prev, [e.key]: now }));
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router, pathname, getCurrentTabIndex, lastKeyTime]);

    return (
        <div className="w-full flex flex-col justify-center px-8">
            <nav className="flex items-center justify-between w-full max-w-3xl mx-auto px-8 py-8">
                <div className="relative flex gap-4">
                    {tabsData.map((tab, idx) => (
                        <Link
                            key={idx}
                            href={tab.href}
                            className="relative inline-block text-gray-400 transition-colors duration-200"
                            style={{
                                color: hoveredTab === idx || getCurrentTabIndex() === idx ? 'var(--accent1)' : undefined,
                                fontWeight: getCurrentTabIndex() === idx ? 'bold' : undefined,
                            } as React.CSSProperties}
                            onMouseEnter={() => setHoveredTab(idx)}
                            onMouseLeave={() => setHoveredTab(null)}
                        >
                            {tab.label}
                            <span
                                className="absolute bottom-0 left-0 h-0.5 bg-[var(--accent1)] transition-all duration-300"
                                style={{
                                    width: getCurrentTabIndex() === idx || hoveredTab === idx ? '100%' : '0%'
                                }}
                            />
                        </Link>
                    ))}
                </div>
            </nav>
        </div >
    );
};

export default Header;
