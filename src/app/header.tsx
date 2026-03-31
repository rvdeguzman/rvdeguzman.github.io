"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const tabsData = [
    { label: "about", href: "/" },
    { label: "posts", href: "/posts" },
];

const Header = () => {
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
                <div className="relative flex gap-6">
                    {tabsData.map((tab, idx) => (
                        <Link
                            key={idx}
                            href={tab.href}
                            className={`ps2-nav-item inline-block text-sm tracking-wide ${getCurrentTabIndex() === idx ? 'active font-bold' : ''}`}
                            style={{
                                color: getCurrentTabIndex() === idx ? 'var(--accent1)' : 'var(--comment)',
                            }}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
                <div className="ps2-help-bar">
                    <span className="flex items-center gap-1">
                        <span className="ps2-key">h</span>
                        <span className="ps2-key">l</span>
                        <span className="ml-0.5">nav</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="ps2-key">j</span>
                        <span className="ps2-key">k</span>
                        <span className="ml-0.5">scroll</span>
                    </span>
                </div>
            </nav>
        </div>
    );
};

export default Header;
