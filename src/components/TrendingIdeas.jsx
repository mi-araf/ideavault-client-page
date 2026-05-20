"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Bookmark,
    Flame,
    Heart,
    MessageCircle,
    Sparkles,
    Target,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function getShortText(text, maxLength = 92) {
    if (!text) return "A fresh startup concept waiting for community validation.";
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
}

export default function TrendingIdeas() {
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadTrendingIdeas() {
            try {
                const res = await fetch(`${API_URL}/trending-ideas`);
                const data = await res.json();
                setIdeas(data);
            } catch (error) {
                console.error("Failed to load trending ideas:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadTrendingIdeas();
    }, []);

    return (
        <section className="relative overflow-hidden bg-base-100 px-4 py-16 dark:bg-slate-950 sm:px-6 sm:py-20 lg:px-8">
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-10 right-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border border-fuchsia-200 bg-white px-4 py-2 text-sm font-bold text-fuchsia-600 shadow-sm dark:border-fuchsia-500/20 dark:bg-white/5 dark:text-fuchsia-300">
                        <Flame size={16} className="animate-bounce" />
                        Trending Startup Ideas
                    </div>

                    <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                        Ideas people are talking about
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                        Explore the most active startup ideas based on community reactions,
                        comments, and bookmarks.
                    </p>
                </div>

                {isLoading ? (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="h-107 animate-pulse rounded-[2rem] bg-white shadow-sm dark:bg-white/5"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {ideas.map((idea, index) => (
                            <article
                                key={idea._id}
                                className="group relative flex h-full min-h-107 flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-fuchsia-300 hover:shadow-2xl hover:shadow-fuchsia-500/10 dark:border-white/10 dark:bg-white/4 dark:hover:border-fuchsia-400/40"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={
                                            idea.imageURL ||
                                            "https://images.unsplash.com/photo-1559136555-9303baea8ebd"
                                        }
                                        alt={idea.ideaTitle}
                                        height={400}
                                        width={400}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-950/80 dark:text-white">
                                        #{index + 1} Trending
                                    </div>

                                    <div className="absolute bottom-4 left-4 rounded-full bg-linear-to-r from-cyan-400 via-fuchsia-500 to-amber-400 px-3 py-1 text-xs font-black text-white shadow-lg">
                                        {idea.category || "Startup"}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-950 transition group-hover:text-fuchsia-600 dark:text-white dark:group-hover:text-fuchsia-300">
                                            {idea.ideaTitle}
                                        </h3>

                                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
                                            <Sparkles size={18} />
                                        </div>
                                    </div>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        {getShortText(idea.shortDescription || idea.detailedDescription)}
                                    </p>

                                    <div className="mt-5 grid gap-3 rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/50">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <Target size={16} className="text-cyan-500" />
                                            <span className="line-clamp-1">
                                                {idea.targetAudience || "Startup founders and early users"}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                                            <span className="flex items-center gap-1.5">
                                                <Heart size={15} className="text-rose-500" />
                                                {idea.likesCount || 0}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <MessageCircle size={15} className="text-cyan-500" />
                                                {idea.commentsCount || 0}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <Bookmark size={15} className="text-amber-500" />
                                                {idea.bookmarksCount || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5">
                                        <Link
                                            href={`/ideas/${idea._id}`}
                                            className="group/btn flex w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-linear-to-r hover:from-cyan-500 hover:via-fuchsia-500 hover:to-amber-400 dark:bg-white dark:text-slate-950 dark:hover:text-white"
                                        >
                                            View Details
                                            <ArrowRight
                                                size={17}
                                                className="transition group-hover/btn:translate-x-1"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link
                        href="/ideas"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:text-fuchsia-600 dark:border-white/10 dark:bg-white/4 dark:text-white dark:hover:border-fuchsia-400/40 dark:hover:text-fuchsia-300"
                    >
                        Explore All Ideas
                        <ArrowRight size={17} />
                    </Link>
                </div>
            </div>
        </section>
    );
}