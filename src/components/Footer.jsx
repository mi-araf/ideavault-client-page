import Link from "next/link";
import {
    Lightbulb,
    Mail,
    MapPin,
    Phone,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa";

const platformLinks = [
    {
        label: "Explore Ideas",
        href: "/ideas",
    },
    {
        label: "Add Idea",
        href: "/add-idea",
    },
    {
        label: "My Ideas",
        href: "/my-ideas",
    },
    {
        label: "My Interactions",
        href: "/my-interactions",
    },
];

const categoryLinks = [
    {
        label: "Tech",
        href: "/ideas?category=Tech",
    },
    {
        label: "Health",
        href: "/ideas?category=Health",
    },
    {
        label: "AI",
        href: "/ideas?category=AI",
    },
    {
        label: "Education",
        href: "/ideas?category=Education",
    },
];

const socialLinks = [
    {
        label: "GitHub",
        href: "https://github.com",
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com",
    },
];

function FooterLink({ href, children }) {
    return (
        <Link
            href={href}
            className="group flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-fuchsia-600 dark:text-slate-400 dark:hover:text-fuchsia-300"
        >
            {children}
            <ArrowUpRight
                size={13}
                className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            />
        </Link>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden border-t border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
            <div className="absolute left-0 top-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex w-fit items-center gap-3">
                            <div className="relative grid h-12 w-12 place-items-center rounded-[1.4rem] bg-linear-to-br from-cyan-400 via-fuchsia-500 to-amber-400 shadow-lg shadow-fuchsia-500/25">
                                <div className="absolute inset-0.75 rounded-[1.15rem] border border-white/40 bg-white/15" />
                                <Lightbulb className="relative z-10 text-white" size={24} />
                            </div>

                            <div>
                                <h2 className="bg-linear-to-r from-cyan-500 via-fuchsia-500 to-amber-500 bg-clip-text font-black tracking-tight text-transparent text-2xl">
                                    IdeaVault
                                </h2>
                                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">
                                    MI ARAF
                                </p>
                            </div>
                        </Link>

                        <p className="mt-5 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                            A creative platform for sharing startup ideas, exploring
                            community feedback, and shaping concepts through meaningful
                            discussions.
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-4 py-2 text-sm font-bold text-fuchsia-700 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
                            <Sparkles size={16} />
                            Validate ideas before building them
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-950 dark:text-white">
                            Platform
                        </h3>

                        <div className="mt-5 grid gap-3">
                            {platformLinks.map((item) => (
                                <FooterLink key={item.href} href={item.href}>
                                    {item.label}
                                </FooterLink>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-950 dark:text-white">
                            Categories
                        </h3>

                        <div className="mt-5 grid gap-3">
                            {categoryLinks.map((item) => (
                                <FooterLink key={item.href} href={item.href}>
                                    {item.label}
                                </FooterLink>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.25em] text-slate-950 dark:text-white">
                            Contact
                        </h3>

                        <div className="mt-5 grid gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <p className="flex items-start gap-3">
                                <Mail size={17} className="mt-0.5 text-fuchsia-500" />
                                arafmushfiq@gmail.com
                            </p>

                            <p className="flex items-start gap-3">
                                <Phone size={17} className="mt-0.5 text-cyan-500" />
                                +880 1552350991
                            </p>

                            <p className="flex items-start gap-3">
                                <MapPin size={17} className="mt-0.5 text-amber-500" />
                                Dhaka, Bangladesh
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <Link
                                href="https://github.com/mi-araf"
                                target="_blank"
                                aria-label="Github"
                                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-600 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:text-fuchsia-600 dark:border-white/10 dark:bg-white/4 dark:text-slate-300 dark:hover:border-fuchsia-400/40 dark:hover:text-fuchsia-300"
                            >
                                <FaGithub />
                            </Link>

                            <Link
                                href="https://instagram.com/tde_araf"
                                target="_blank"
                                aria-label="Instagram"
                                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-600 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:text-fuchsia-600 dark:border-white/10 dark:bg-white/4 dark:text-slate-300 dark:hover:border-fuchsia-400/40 dark:hover:text-fuchsia-300"
                            >
                                <FaInstagram />
                            </Link>

                            <Link
                                href="https://facebook.com/mushfiq.araf.2024"
                                target="_blank"
                                aria-label="Facebook"
                                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-600 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:text-fuchsia-600 dark:border-white/10 dark:bg-white/4 dark:text-slate-300 dark:hover:border-fuchsia-400/40 dark:hover:text-fuchsia-300"
                            >
                                f
                            </Link>

                            <Link
                                href="https://x.com"
                                target="_blank"
                                aria-label="X"
                                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-600 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:text-fuchsia-600 dark:border-white/10 dark:bg-white/4 dark:text-slate-300 dark:hover:border-fuchsia-400/40 dark:hover:text-fuchsia-300"
                            >
                                𝕏
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                <div className="mt-5 flex flex-col gap-4  md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        © {currentYear} IdeaVault. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link href="/" className="transition hover:text-fuchsia-500">
                            Privacy Policy
                        </Link>
                        <Link href="/" className="transition hover:text-fuchsia-500">
                            Terms
                        </Link>
                        <Link href="/" className="transition hover:text-fuchsia-500">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}