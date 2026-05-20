"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Lightbulb, Moon, Sun } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const isLoggedIn = Boolean(user);

    const [avatarError, setAvatarError] = useState(false);

    const firstName = user?.name?.trim()?.split(" ")?.[0] || "User";

    const userInitials =
        user?.name
            ?.trim()
            ?.replace(/\s+/g, "")
            ?.slice(0, 2)
            ?.toUpperCase() ||
        user?.email
            ?.trim()
            ?.slice(0, 2)
            ?.toUpperCase() ||
        "U";

    const hasValidAvatar = Boolean(user?.image) && !avatarError;

    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
    }, []);

    useEffect(() => {
        setAvatarError(false);
    }, [user?.image]);

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

    const buttonAnimation = "relative overflow-hidden rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95 before:absolute before:inset-0 before:-translate-x-full before:bg-white/15 before:transition-transform before:duration-500 hover:before:translate-x-0";

    const primaryButtonClass = `${buttonAnimation} btn btn-primary btn-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/35`;

    const ghostButtonClass = `${buttonAnimation} btn btn-ghost btn-sm hover:bg-base-200 hover:shadow-md`;

    const iconButtonClass = "btn btn-ghost btn-circle transition-all duration-300 ease-out hover:-translate-y-0.5 hover:rotate-6 hover:bg-primary/10 hover:text-primary hover:shadow-md active:scale-90";

    const getNavLinkClass = (path) => {
        const active = isActivePath(path);

        return `group relative overflow-hidden rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95 ${active
            ? "bg-primary text-primary-content shadow-lg shadow-primary/25"
            : "text-base-content/80 hover:bg-base-100 hover:text-primary hover:shadow-md"
            }`;
    };

    const getMobileNavLinkClass = (path) => {
        const active = isActivePath(path);

        return `relative block overflow-hidden rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ease-out hover:translate-x-1 active:scale-95 ${active
            ? "bg-primary text-primary-content shadow-lg shadow-primary/25"
            : "text-base-content/80 hover:bg-base-200 hover:text-primary"
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
                            className={iconButtonClass}
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
                                    <Link href="/login" className={ghostButtonClass}>
                                        Login
                                    </Link>

                                    <Link href="/register" className={primaryButtonClass}>
                                        Register
                                    </Link>
                                </div>
                            )}

                            {!isPending && isLoggedIn && (
                                <div className="grid gap-2">
                                    <Link href="/profile" className="btn btn-ghost btn-sm rounded-xl">
                                        <CgProfile size={14} /> My Profile
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
                        className={iconButtonClass}
                        aria-label="Toggle light and dark mode"
                        title="Toggle light/dark mode"
                    >
                        {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
                    </button>

                    {/* Logged Out Buttons */}
                    {!isPending && !isLoggedIn && (
                        <div className="hidden items-center gap-2 sm:flex">
                            <Link href="/login" className={ghostButtonClass}>
                                Login
                            </Link>

                            <Link href="/register" className={primaryButtonClass}>
                                Register
                            </Link>
                        </div>
                    )}

                    {/* Logged In User Dropdown */}
                    {!isPending && isLoggedIn && (
                        <div className="dropdown dropdown-end cursor-pointer">
                            <button
                                tabIndex={0}
                                type="button"
                                className="flex items-center gap-2 rounded-full px-2 py-1.5 transition-all duration-300 hover:bg-base-200 hover:shadow-md active:scale-95"
                                aria-label="Open profile menu"
                            >
                                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-base-300 text-sm font-semibold uppercase text-base-content">
                                    {hasValidAvatar ? (
                                        <Image
                                            src={user.image}
                                            alt={user?.name || "User"}
                                            height={15} width={15}
                                            className="h-full w-full object-cover"
                                            onError={() => setAvatarError(true)}
                                        />
                                    ) : (
                                        userInitials
                                    )}
                                </div>

                                <span className="hidden max-w-24 truncate text-sm font-bold text-base-content sm:block">
                                    {firstName}
                                </span>

                                <ChevronDown
                                    size={16}
                                    className="hidden text-base-content/70 transition-transform duration-300 sm:block"
                                />
                            </button>

                            <ul
                                tabIndex={0}
                                className="menu dropdown-content mt-3 w-64 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl"
                            >
                                <li className="mb-2 px-3 py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-base-300 text-sm font-semibold uppercase text-base-content">
                                            {hasValidAvatar ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user?.name || "User"}
                                                    height={15} width={15}
                                                    className="h-full w-full object-cover"
                                                    onError={() => setAvatarError(true)}
                                                />
                                            ) : (
                                                userInitials
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold leading-tight">
                                                {user?.name || "IdeaVault User"}
                                            </p>
                                            <p className="truncate text-xs text-base-content/60">
                                                {user?.email || "user@example.com"}
                                            </p>
                                        </div>
                                    </div>
                                </li>

                                <li>
                                    <Link href="/profile">
                                        <CgProfile size={16} /> My Profile
                                    </Link>
                                </li>

                                <li className="mt-2">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className={`${buttonAnimation} btn btn-error btn-sm text-error-content shadow-lg shadow-error/20 hover:shadow-xl`}
                                    >
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