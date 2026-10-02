export const about = {
    greeting: "hi, i'm raf",
    tagline: "cs @ concordia · montréal",
    body: "i study computer science at concordia and build software for a living. i care about calm tools: terminal interfaces, good keyboards, and workflows that get out of the way. outside of code, i make music, take photos, and create content about tech. this site is where i write things down.",
};

export const now = {
    updated: "august 2025",
    items: [
        "working as a software developer at intact",
        "tinkering with TUIs and my keyboard setup",
        "making music and taking photos around montréal",
    ],
};

export const posts = [
    { title: "Mechanical Keyboards", description: "Endgame is a myth", date: "2025-10-15", href: "/posts/kbds" },
    { title: "ConUHacks X Experience", description: "Deck dropout challenge", date: "2025-10-15", href: "/posts/conuhacks_x" },
];

export const projects = [
    { title: "Ray^2caster", description: "raycaster engine in C, following lodev's tutorial", tags: ["C", "raylib"], href: "https://github.com/rvdeguzman/raycaster" },
    { title: "Raysteroids", description: "classic asteroids remake in C", tags: ["C", "raylib"], href: "https://github.com/rvdeguzman/raysteroid" },
    { title: "Pomobot", description: "discord bot for pomodoro tracking with leaderboards", tags: ["Python", "Discord API"], href: "https://github.com/rvdeguzman/pomobot" },
    { title: "Deck Dropout Challenge", description: "conuhacks x deck dropout challenge", tags: ["Python", "Playwright"], href: "https://github.com/juliencm-dev/deck-challenge-conuhackx" },
];

export const experience = [
    { company: "Intact", role: "AI Developer I", date: "S2026", location: "Montréal, QC", tags: ["coming soon"] },
    { company: "Intact", role: "Software Developer I", date: "F2025", location: "Montréal, QC", tags: ["Angular", "Spring Boot"] },
    { company: "Université de Montréal", role: "Full Stack Research Assistant", date: "W2025", location: "Montréal, QC", tags: ["FastAPI", "React", "PostgreSQL"] },
    { company: "IEEE Concordia", role: "Director of Development", date: "W2025", location: "Montréal, QC", tags: ["React", "Supabase"] },
    { company: "Acculete Inc.", role: "Software Developer", date: "S2024", location: "Ottawa, ON", tags: ["C++", "Flutter", "Firebase"] },
    { company: "ChargeHub", role: "Software Developer Intern", date: "W2023", location: "Pointe-Claire, QC", tags: ["Vue.js", "Node.js", "MSSQL"] },
];

export const education = [
    { school: "Concordia University", degree: "BCompSc, Computer Science Co-op", date: "F2023 – W2027", location: "Montréal, QC" },
    { school: "John Abbott College", degree: "DEC, Computer Science", date: "F2020 – W2023", location: "Ste-Anne-de-Bellevue, QC" },
];

export const socials = [
    { label: "github", href: "https://github.com/rvdeguzman" },
    { label: "linkedin", href: "https://linkedin.com/in/rvdeguzman" },
    { label: "email", href: "mailto:raf@rvdeguzman.com" },
];

export const nav = [
    { label: "about", href: "/" },
    { label: "posts", href: "/posts" },
    { label: "misc", href: "/misc" },
];
