"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    CalendarDays,
    MessageCircle,
    MessagesSquare,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const MyInteractionsPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [interactions, setInteractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login?callbackURL=/my-interactions");
        }
    }, [isPending, session, router]);

    useEffect(() => {
        const loadInteractions = async () => {
            if (!user?.email) return;

            try {
                setIsLoading(true);

                const res = await fetch(
                    `${API_URL}/my-interactions?email=${encodeURIComponent(user.email)}`
                );

                if (!res.ok) {
                    throw new Error("Failed to load interactions.");
                }

                const data = await res.json();
                setInteractions(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load your interactions.");
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            loadInteractions();
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
        <section className="relative overflow-hidden bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative mx-auto max-w-5xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
                        <Sparkles size={16} />
                        Activity Center
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                        My Interactions
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-base-content/70 sm:text-base">
                        A simple list of startup ideas where you joined the discussion.
                    </p>
                </div>

                {interactions.length === 0 ? (
                    <div className="mx-auto mt-12 max-w-xl rounded-[2rem] border border-base-300 bg-base-200/60 p-8 text-center shadow-xl">
                        <MessageCircle className="mx-auto text-primary" size={42} />

                        <h2 className="mt-4 text-2xl font-black text-base-content">
                            No interactions yet
                        </h2>

                        <p className="mt-2 text-sm text-base-content/70">
                            Comment on an idea and it will appear here.
                        </p>

                        <Link href="/ideas" className="btn btn-primary mt-6 rounded-xl">
                            Explore Ideas
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-12 space-y-4">
                        {interactions.map((idea) =>
                            idea.myComments?.map((comment) => (
                                <article
                                    key={comment._id}
                                    className="rounded-2xl border border-base-300 bg-base-200/60 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg sm:p-5"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary/10">
                                            {comment.userImage ? (
                                                <Image
                                                    src={comment.userImage}
                                                    alt={comment.userName || "IdeaVault User"}
                                                    height={20} width={20}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center text-sm font-black text-primary">
                                                    {comment.userName?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold text-base-content/50">
                                                        {comment.userName || "IdeaVault User"} commented on
                                                    </p>

                                                    <h2 className="mt-1 line-clamp-1 text-lg font-black text-base-content">
                                                        {idea.ideaTitle}
                                                    </h2>
                                                </div>

                                                <Link
                                                    href={`/ideas/${idea._id}`}
                                                    className="btn btn-primary btn-sm rounded-xl"
                                                >
                                                    View Idea
                                                    <ArrowRight size={15} />
                                                </Link>
                                            </div>

                                            <p className="mt-3 rounded-2xl bg-base-100/80 p-4 text-sm leading-6 text-base-content/70">
                                                {comment.commentText}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-base-content/50">
                                                <span>{formatDate(comment.createdAt)}</span>

                                                {comment.updatedAt && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Edited</span>
                                                    </>
                                                )}

                                                {idea.category && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="font-bold text-primary">
                                                            {idea.category}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MyInteractionsPage;