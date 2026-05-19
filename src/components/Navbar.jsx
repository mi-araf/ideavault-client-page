"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lightbulb, Moon, Sun } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const isLoggedIn = Boolean(user);

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

    const allLinks = [...publicLinks, ...privateLinks];

    const isActivePath = (path) => {
        if (path === "/") return pathname === "/";
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const getHref = (path) => {
        const isPrivate = privateLinks.some((link) => link.path === path);

        if (isPrivate && !isLoggedIn) {
            return `/login?callbackURL=${encodeURIComponent(path)}`;
        }

        return path;
    };

    const getNavLinkClass = (path) => {
        const active = isActivePath(path);

        return `relative rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 ${active
                ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
            }`;
    };

    const getMobileNavLinkClass = (path) => {
        const active = isActivePath(path);

        return `block rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ${active
                ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
            }`;
    };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out successfully.");
                    router.push("/login");
                },
                onError: () => {
                    toast.error("Logout failed. Please try again.");
                },
            },
        });
    };

    return (
        <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 shadow-sm backdrop-blur">
            <nav className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="navbar-start">
                    {/* Mobile Dropdown */}
                    <div className="dropdown md:hidden">
                        <button
                            tabIndex={0}
                            type="button"
                            className="btn btn-ghost btn-circle transition-all duration-300 hover:rotate-6 hover:bg-primary/10 hover:text-primary"
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
                            {allLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    href={getHref(link.path)}
                                    className={getMobileNavLinkClass(link.path)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="my-3 h-px bg-base-300" />

                            {!isPending && !isLoggedIn && (
                                <div className="grid gap-2">
                                    <Link href="/login" className="btn btn-ghost btn-sm rounded-xl">
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="btn btn-primary btn-sm rounded-xl shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}

                            {!isPending && isLoggedIn && (
                                <div className="grid gap-2">
                                    <Link href="/profile" className="btn btn-ghost btn-sm rounded-xl">
                                        Profile Management
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="btn btn-error btn-sm rounded-xl text-error-content"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="group flex w-fit items-center gap-3">
                        <div className="relative grid h-12 w-12 place-items-center rounded-[1.4rem] bg-linear-to-br from-cyan-400 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/25 transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
                            <div className="absolute inset-0.75 rounded-[1.15rem] border border-white/40 bg-white/15" />
                            <Lightbulb className="relative z-10 text-white" size={24} />
                        </div>

                        <div>
                            <h2 className="bg-linear-to-r from-cyan-500 via-fuchsia-500 to-amber-500 bg-clip-text text-2xl font-black tracking-tight text-transparent">
                                IdeaVault
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-base-content/40">
                                MI ARAF
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Desktop / Tablet Links */}
                <div className="navbar-center hidden md:flex">
                    <div className="flex items-center gap-1 rounded-2xl bg-base-200/50 p-1">
                        {allLinks.map((link) => (
                            <Link
                                key={link.path}
                                href={getHref(link.path)}
                                className={getNavLinkClass(link.path)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="navbar-end gap-2">
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="btn btn-ghost btn-circle transition-all duration-300 hover:-translate-y-0.5 hover:rotate-6 hover:bg-primary/10 hover:text-primary"
                        aria-label="Toggle light and dark mode"
                        title="Toggle light/dark mode"
                    >
                        {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
                    </button>

                    {/* Logged Out Buttons */}
                    {!isPending && !isLoggedIn && (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link
                                href="/login"
                                className="btn btn-ghost btn-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-base-200"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="btn btn-primary btn-sm rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Logged In User Dropdown */}
                    {!isPending && isLoggedIn && (
                        <div className="dropdown dropdown-end">
                            <button
                                tabIndex={0}
                                type="button"
                                className="btn btn-ghost btn-circle avatar transition hover:-translate-y-0.5"
                                aria-label="Open profile menu"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-content ring ring-primary ring-offset-2 ring-offset-base-100">
                                    {user?.image ? (
                                        <Image
                                            src={user.image}
                                            alt={user?.name || "User"}
                                            width={20}
                                            height={20}
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        user?.name?.charAt(0)?.toUpperCase() ||
                                        user?.email?.charAt(0)?.toUpperCase() ||
                                        "U"
                                    )}
                                </div>
                            </button>

                            <ul
                                tabIndex={0}
                                className="menu dropdown-content mt-3 w-64 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
                            >
                                <li className="mb-2 px-3 py-2">
                                    <p className="font-semibold leading-tight">
                                        {user?.name || "IdeaVault User"}
                                    </p>
                                    <p className="text-xs text-base-content/60">
                                        {user?.email || "user@example.com"}
                                    </p>
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
                                    <button type="button" onClick={handleLogout} className="text-error">
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