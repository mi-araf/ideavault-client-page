"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    BadgeDollarSign,
    Bookmark,
    CalendarDays,
    Lightbulb,
    Sparkles,
    Target,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getAuthOnlyHeaders } from "@/lib/api";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const BookmarksPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login?callbackURL=/bookmarks");
        }
    }, [isPending, session, router]);

    useEffect(() => {
        const loadBookmarks = async () => {
            if (!user?.email) return;

            try {
                setIsLoading(true);

                const res = await fetch(`${API_URL}/my-bookmarks`, {
                    headers: getAuthOnlyHeaders(),
                });

                if (!res.ok) {
                    throw new Error("Failed to load bookmarks.");
                }

                const data = await res.json();
                setBookmarks(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load bookmarked ideas.");
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            loadBookmarks();
        }
    }, [session, user?.email]);

    if (isPending || isLoading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </section>
        );
    }

    if (!session) return null;

    return (
        <section className="relative min-h-screen overflow-hidden bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-warning/10 blur-3xl" />
            <div className="absolute bottom-20 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative mx-auto max-w-6xl">
                <div className="bookmark-slide-up mx-auto max-w-3xl text-center">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-warning/20 bg-warning/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-warning sm:text-sm">
                        <Bookmark size={16} className="animate-pulse" />
                        Saved Ideas
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                        My Bookmarks
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-base-content/70 sm:text-base">
                        A simple list of startup ideas you saved for later.
                    </p>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="bookmark-slide-up mx-auto mt-12 max-w-xl rounded-[2rem] border border-base-300 bg-base-200/60 p-8 text-center shadow-xl">
                        <Lightbulb className="mx-auto text-warning" size={42} />

                        <h2 className="mt-4 text-2xl font-black text-base-content">
                            No bookmarks yet
                        </h2>

                        <p className="mt-2 text-sm text-base-content/70">
                            Bookmark an idea from the idea details page and it will appear here.
                        </p>

                        <Link href="/ideas" className="btn btn-primary mt-6 rounded-xl">
                            Explore Ideas
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-12 space-y-4">
                        {bookmarks.map((idea, index) => (
                            <article
                                key={idea._id}
                                className="bookmark-slide-up rounded-[1.8rem] border border-base-300 bg-base-200/60 p-4 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-warning/40 hover:shadow-xl sm:p-5"
                                style={{ animationDelay: `${index * 0.06}s` }}
                            >
                                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="relative h-28 w-full overflow-hidden rounded-[1.4rem] bg-base-300 sm:h-24 sm:w-32">
                                            <Image
                                                src={
                                                    idea.imageURL ||
                                                    "https://images.unsplash.com/photo-1559136555-9303baea8ebd"
                                                }
                                                alt={idea.ideaTitle || "Bookmarked idea"}
                                                width={220}
                                                height={160}
                                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                                            />

                                            <div className="absolute left-2 top-2 rounded-full bg-warning px-2.5 py-1 text-[10px] font-black text-warning-content">
                                                Saved
                                            </div>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                                                    {idea.category || "Startup"}
                                                </span>

                                                <span className="flex items-center gap-1 rounded-full bg-base-100 px-3 py-1 text-xs font-bold text-base-content/50">
                                                    <CalendarDays size={13} />
                                                    {formatDate(idea.bookmarkedAt)}
                                                </span>
                                            </div>

                                            <h2 className="line-clamp-1 text-xl font-black text-base-content">
                                                {idea.ideaTitle}
                                            </h2>

                                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-base-content/70">
                                                {idea.shortDescription ||
                                                    idea.detailedDescription ||
                                                    "A saved startup idea from your collection."}
                                            </p>

                                            <div className="mt-3 flex flex-wrap gap-3 text-sm text-base-content/60">
                                                <span className="flex items-center gap-1.5">
                                                    <Target size={15} className="text-primary" />
                                                    {idea.targetAudience || "Startup users"}
                                                </span>

                                                <span className="flex items-center gap-1.5">
                                                    <BadgeDollarSign
                                                        size={15}
                                                        className="text-success"
                                                    />
                                                    {idea.estimatedBudget
                                                        ? `$${idea.estimatedBudget}`
                                                        : "No budget"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link href={`/ideas/${idea._id}`} className="btn btn-primary rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 md:shrink-0" >
                                        View Idea
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BookmarksPage;