import { Link, NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

function Header() {

    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved) return saved === "dark";
        return true;
    });

    const [scrolled, setScrolled] = useState(false);

    // openMenu: null | "learn" | "practice"
    const [openMenu, setOpenMenu] = useState(null);

    const headerRef = useRef(null);

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (headerRef.current && !headerRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const navClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;

    // Close dropdown then let NavLink navigate
    const dropdownClass = ({ isActive }) =>
        `dropdown ${isActive ? "active" : ""}`;

    const close = () => setOpenMenu(null);

    const toggle = (menu) =>
        setOpenMenu((prev) => (prev === menu ? null : menu));

    return (
        <header
            ref={headerRef}
            className={`glass-nav sticky top-0 z-50 ${scrolled ? "scrolled" : ""}`}
        >

            <div className="w-full flex items-center justify-between px-12 py-3">

                {/* LOGO */}
                <Link to="/" className="flex items-center gap-2 no-underline group">

                    <div className="w-8 h-8 flex items-center justify-center rounded-md
                        border border-green-500 dark:border-[#00FF41]
                        text-green-600 dark:text-[#00FF41]
                        group-hover:shadow-[0_0_10px_rgba(0,200,60,0.4)] dark:group-hover:shadow-[0_0_10px_rgba(0,255,65,0.4)]
                        transition-shadow duration-200">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 5l3 3-3 3M9 11h4"
                                stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-400
                        bg-clip-text text-transparent
                        group-hover:from-green-400 group-hover:to-emerald-300
                        transition-all duration-200">
                        CodeXpert
                    </span>

                </Link>

                {/* CENTER MENU */}
                <nav className="flex items-center gap-8">

                    <NavLink to="/" end className={navClass}>
                        Home
                    </NavLink>

                    {/* LEARN */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("learn")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >

                        <button
                            className={`nav-link ${openMenu === "learn" ? "active" : ""}`}
                            onClick={() => toggle("learn")}
                        >
                            Learn
                            <svg
                                className={`inline-block ml-1 w-3 h-3 transition-transform duration-200
                                    ${openMenu === "learn" ? "rotate-180" : ""}`}
                                viewBox="0 0 10 10" fill="none"
                            >
                                <path d="M2 3.5l3 3 3-3"
                                    stroke="currentColor" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className={`dropdown-menu ${openMenu === "learn" ? "dropdown-open" : ""}`}>

                            <NavLink to="/courses" className={dropdownClass} onClick={close}>Courses</NavLink>
                            <NavLink to="/tutorials" className={dropdownClass} onClick={close}>Tutorials</NavLink>
                            <NavLink to="/notes" className={dropdownClass} onClick={close}>Notes</NavLink>
                            <NavLink to="/roadmaps" className={dropdownClass} onClick={close}>Roadmaps</NavLink>

                        </div>

                    </div>

                    {/* PRACTICE */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenMenu("practice")}
                        onMouseLeave={() => setOpenMenu(null)}
                    >

                        <button
                            className={`nav-link ${openMenu === "practice" ? "active" : ""}`}
                            onClick={() => toggle("practice")}
                        >
                            Practice
                            <svg
                                className={`inline-block ml-1 w-3 h-3 transition-transform duration-200
                                    ${openMenu === "practice" ? "rotate-180" : ""}`}
                                viewBox="0 0 10 10" fill="none"
                            >
                                <path d="M2 3.5l3 3 3-3"
                                    stroke="currentColor" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className={`dropdown-menu ${openMenu === "practice" ? "dropdown-open" : ""}`}>

                            <NavLink to="/projects" className={dropdownClass} onClick={close}>Projects</NavLink>
                            <NavLink to="/quiz" className={dropdownClass} onClick={close}>Quiz</NavLink>

                        </div>

                    </div>

                </nav>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3">

                    <Link to="/signup" className="btn-neon">
                        + Join
                    </Link>

                    <button onClick={() => setDark(!dark)} className="btn-theme" aria-label="Toggle theme">
                        {dark ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="5" />
                                <line x1="12" y1="1" x2="12" y2="3" />
                                <line x1="12" y1="21" x2="12" y2="23" />
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                <line x1="1" y1="12" x2="3" y2="12" />
                                <line x1="21" y1="12" x2="23" y2="12" />
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        )}
                    </button>

                </div>

            </div>

        </header>
    );
}

export default Header;