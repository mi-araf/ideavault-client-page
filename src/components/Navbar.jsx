"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lightbulb } from "lucide-react";

const Navbar = ({ user = null }) => {
    // For now, private links stay hidden because user is null by default.
    // After authentication, pass the logged-in user object as the `user` prop.
    const isLoggedIn = Boolean(user);
    const pathname = usePathname();

    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
    };

    const publicLinks = [
        { name: "Home", path: "/" },
        { name: "Ideas", path: "/ideas" },
    ];

    const privateLinks = [
        { name: "Add Idea", path: "/add-idea" },
        { name: "My Ideas", path: "/my-ideas" },
        { name: "My Interactions", path: "/my-interactions" },
    ];

    const isActivePath = (path) => {
        if (path === "/") return pathname === "/";
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const getNavLinkClass = (path) => {
        const active = isActivePath(path);

        return `rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${active
                ? "bg-primary text-primary-content"
                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
            }`;
    };

    const getMobileNavLinkClass = (path) => {
        const active = isActivePath(path);

        return `block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${active
                ? "bg-primary text-primary-content"
                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
            }`;
    };

    return (
        <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 shadow-sm backdrop-blur">
            <nav className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="navbar-start">
                    {/* Mobile Dropdown - mobile only, hidden on tablet and desktop */}
                    <div className="dropdown md:hidden">
                        <button
                            tabIndex={0}
                            type="button"
                            className="btn btn-ghost btn-circle"
                            aria-label="Open menu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <div
                            tabIndex={0}
                            className="menu dropdown-content mt-3 w-64 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
                        >
                            {publicLinks.map((link) => (
                                <Link key={link.path} href={link.path} className={getMobileNavLinkClass(link.path)}>
                                    {link.name}
                                </Link>
                            ))}

                            {isLoggedIn &&
                                privateLinks.map((link) => (
                                    <Link key={link.path} href={link.path} className={getMobileNavLinkClass(link.path)}>
                                        {link.name}
                                    </Link>
                                ))}

                            <div className="divider my-2" />

                            {!isLoggedIn ? (
                                <div className="grid gap-2">
                                    <Link href="/login" className="btn btn-outline btn-sm">
                                        Login
                                    </Link>
                                    <Link href="/register" className="btn btn-primary btn-sm">
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid gap-2">
                                    <Link href="/profile" className="btn btn-outline btn-sm">
                                        Profile Management
                                    </Link>
                                    <button type="button" className="btn btn-error btn-sm text-error-content">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logo / Website Name */}
                    <Link href="/" className="flex w-fit items-center gap-3">
                        <div className="relative grid h-12 w-12 place-items-center rounded-[1.4rem] bg-linear-to-br from-cyan-400 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/25">
                            <div className="absolute inset-0.75 rounded-[1.15rem] border border-white/40 bg-white/15" />
                            <Lightbulb className="relative z-10 text-white" size={24} />
                        </div>

                        <div>
                            <h2 className="bg-linear-to-r from-cyan-500 via-fuchsia-500 to-amber-500 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                                IdeaVault
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                                MI ARAF
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Desktop / Tablet Links - visible from tablet size and up */}
                <div className="navbar-center hidden md:flex">
                    <div className="flex items-center gap-1">
                        {publicLinks.map((link) => (
                            <Link key={link.path} href={link.path} className={getNavLinkClass(link.path)}>
                                {link.name}
                            </Link>
                        ))}

                        {isLoggedIn &&
                            privateLinks.map((link) => (
                                <Link key={link.path} href={link.path} className={getNavLinkClass(link.path)}>
                                    {link.name}
                                </Link>
                            ))}
                    </div>
                </div>

                <div className="navbar-end gap-2">
                    {/* Light / Dark Mode Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="btn btn-ghost btn-circle"
                        aria-label="Toggle light and dark mode"
                        title="Toggle light/dark mode"
                    >
                        {theme === "light" ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="12" r="5" />
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                        )}
                    </button>

                    {/* Logged Out Buttons */}
                    {!isLoggedIn && (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link href="/login" className="btn btn-ghost btn-sm">
                                Login
                            </Link>
                            <Link href="/register" className="btn btn-primary btn-sm">
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Logged In User Dropdown */}
                    {isLoggedIn && (
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                type="button"
                                className="btn btn-ghost btn-circle avatar"
                                aria-label="Open profile menu"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content ring ring-primary ring-offset-2 ring-offset-base-100">
                                    {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            </button>

                            <ul
                                tabIndex={0}
                                className="menu dropdown-content mt-3 w-64 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
                            >
                                <li className="mb-2 px-3 py-2">
                                    <p className="font-semibold leading-tight">{user?.name || "IDEAVAULT User"}</p>
                                    <p className="text-xs text-base-content/60">{user?.email || "user@example.com"}</p>
                                </li>
                                <li>
                                    <Link href="/profile">Profile Management</Link>
                                </li>
                                <li>
                                    <Link href="/my-ideas">My Ideas</Link>
                                </li>
                                <li>
                                    <Link href="/my-interactions">My Interactions</Link>
                                </li>
                                <li className="mt-2">
                                    <button type="button" className="text-error">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
