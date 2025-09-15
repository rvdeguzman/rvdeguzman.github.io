"use client";

import { useState } from "react";
import Link from "next/link";

const tabsData = [
    { label: "about", href: "/" },
    { label: "posts", href: "/posts" },
    { label: "misc", href: "/misc" },
];

const Header = () => {
    const [hoveredTab, setHoveredTab] = useState(null);

    return (
        <div className="w-full flex flex-col justify-center px-8">
            <nav className="flex items-center justify-between w-full max-w-2xl mx-auto pt-8 pb-8 sm:pb-16">
                <div className="relative flex gap-6">
                    {tabsData.map((tab, idx) => (
                        <Link
                            key={idx}
                            href={tab.href}
                            className="relative px-3 py-2 text-gray-400 transition-colors duration-200"
                            style={{ color: hoveredTab === idx ? 'var(--accent1)' : '#fbcb97' }}
                            onMouseEnter={() => setHoveredTab(idx)}
                            onMouseLeave={() => setHoveredTab(null)}
                        >
                            {tab.label}
                            {hoveredTab === idx && (
                                <span className="absolute inset-0 transition-all duration-500 -z-10" style={{ backgroundColor: 'var(--bg-hover)' }} />
                            )}
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default Header;
