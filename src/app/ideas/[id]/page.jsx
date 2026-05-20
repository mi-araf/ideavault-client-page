"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    BadgeDollarSign,
    Bookmark,
    CalendarDays,
    Edit3,
    Heart,
    Lightbulb,
    MessageCircle,
    Rocket,
    Send,
    Sparkles,
    Target,
    Trash2,
    UserRound,
    Users,
    X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { getAuthHeaders, getAuthOnlyHeaders } from "@/lib/api";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatDate(date) {
    if (!date) return "Just now";

    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const IdeaDetailsPage = () => {
    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [idea, setIdea] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [isBookmarking, setIsBookmarking] = useState(false);

    useEffect(() => {
        if (!isPending && !session) {
            router.push(`/login?callbackURL=/ideas/${id}`);
        }
    }, [isPending, session, router, id]);

    useEffect(() => {
        if (!session || !id) return;

        const loadIdeaDetails = async () => {
            try {
                const ideaRes = await fetch(`${API_URL}/ideas/${id}`);
                const ideaData = await ideaRes.json();

                const commentRes = await fetch(`${API_URL}/ideas/${id}/comments`);
                const commentData = await commentRes.json();

                setIdea(ideaData);
                setComments(commentData);

                setBookmarkCount(ideaData?.bookmarksCount || 0);

                const bookmarkRes = await fetch(`${API_URL}/ideas/${id}/bookmark-status`, {
                    headers: getAuthOnlyHeaders(),
                });

                const bookmarkData = await bookmarkRes.json();

                if (bookmarkData.success) {
                    setIsBookmarked(bookmarkData.bookmarked);
                    setBookmarkCount(bookmarkData.bookmarksCount || 0);
                }

            } catch (error) {
                toast.error("Failed to load idea details.");
            } finally {
                setIsLoading(false);
            }
        };

        loadIdeaDetails();
    }, [id, session, user?.email]);

    useEffect(() => {
        if (idea?.ideaTitle) {
            document.title = `${idea.ideaTitle} | IdeaVault`;
        }
    }, [idea]);

    const reloadComments = async () => {
        const res = await fetch(`${API_URL}/ideas/${id}/comments`);
        const data = await res.json();
        setComments(data);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!commentText.trim()) {
            toast.error("Please write a comment first.");
            return;
        }

        const newComment = {
            userName: user?.name || "IdeaVault User",
            userEmail: user?.email,
            userImage: user?.image || "",
            commentText,
        };

        try {
            setIsSubmitting(true);

            const res = await fetch(`${API_URL}/ideas/${id}/comments`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(newComment),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to add comment.");
            }

            toast.success("Comment added successfully.");
            setCommentText("");
            reloadComments();

            setIdea((currentIdea) => ({
                ...currentIdea,
                commentsCount: (currentIdea?.commentsCount || 0) + 1,
            }));
        } catch (error) {
            toast.error(error.message || "Failed to add comment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingText(comment.commentText);
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditingText("");
    };

    const handleUpdateComment = async (commentId) => {
        if (!editingText.trim()) {
            toast.error("Comment cannot be empty.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    commentText: editingText,
                    userEmail: user?.email,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update comment.");
            }

            toast.success("Comment updated successfully.");
            cancelEditComment();
            reloadComments();
        } catch (error) {
            toast.error(error.message || "Failed to update comment.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    userEmail: user?.email,
                    ideaId: id,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to delete comment.");
            }

            toast.success("Comment deleted successfully.");
            reloadComments();

            setIdea((currentIdea) => ({
                ...currentIdea,
                commentsCount: Math.max((currentIdea?.commentsCount || 1) - 1, 0),
            }));
        } catch (error) {
            toast.error(error.message || "Failed to delete comment.");
        }
    };

    const handleToggleBookmark = async () => {
        if (!user?.email) {
            toast.error("Please login first.");
            return;
        }

        try {
            setIsBookmarking(true);

            const res = await fetch(`${API_URL}/ideas/${id}/bookmark`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({}),
                // body: JSON.stringify({
                //     userEmail: user.email,
                //     userName: user.name,
                //     userImage: user.image || "",
                // }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update bookmark.");
            }

            setIsBookmarked(data.bookmarked);
            setBookmarkCount(data.bookmarksCount || 0);

            toast.success(data.bookmarked ? "Idea bookmarked." : "Bookmark removed.");
        } catch (error) {
            toast.error(error.message || "Failed to update bookmark.");
        } finally {
            setIsBookmarking(false);
        }
    };

    if (isPending || isLoading) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-base-100">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-sm font-semibold text-base-content/60">
                        Loading idea details...
                    </p>
                </div>
            </section>
        );
    }

    if (!session) {
        return null;
    }

    if (!idea) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-base-100 px-4">
                <div className="max-w-md rounded-[2rem] border border-base-300 bg-base-200/60 p-8 text-center shadow-xl">
                    <Lightbulb className="mx-auto text-primary" size={42} />
                    <h1 className="mt-4 text-2xl font-black text-base-content">
                        Idea not found
                    </h1>
                    <p className="mt-2 text-sm text-base-content/70">
                        This idea may have been removed or does not exist.
                    </p>
                    <Link href="/ideas" className="btn btn-primary mt-6 rounded-xl">
                        Back to Ideas
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <Link
                    href="/ideas"
                    className="btn btn-ghost mb-6 rounded-xl transition-all duration-300 hover:-translate-x-1 hover:bg-base-200"
                >
                    <ArrowLeft size={18} />
                    Back to Ideas
                </Link>

                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">

                    <article className="overflow-hidden rounded-[2rem] border border-base-300 bg-base-200/60 shadow-xl backdrop-blur">
                        <div className="relative h-64 overflow-hidden sm:h-80">
                            <Image
                                src={
                                    idea.imageURL ||
                                    "https://images.unsplash.com/photo-1559136555-9303baea8ebd"
                                }
                                alt={idea.userName || "User"}
                                height={400}
                                width={400}
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute left-5 top-5 rounded-full bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-primary-content shadow-lg">
                                {idea.category || "Startup"}
                            </div>

                            <div className="absolute bottom-5 left-5 right-5">
                                <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                                    {idea.ideaTitle}
                                </h1>

                                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                                    {idea.shortDescription}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7 lg:p-8">
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="rounded-2xl bg-mist-400/30 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <Heart className="text-error" size={22} />
                                    <p className="mt-2 text-xl font-black text-base-content">
                                        {idea.likesCount || 0}
                                    </p>
                                    <p className="text-xs font-semibold text-base-content/60">
                                        Likes
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-mist-400/30 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                    <MessageCircle className="text-primary" size={22} />
                                    <p className="mt-2 text-xl font-black text-base-content">
                                        {idea.commentsCount || comments.length || 0}
                                    </p>
                                    <p className="text-xs font-semibold text-base-content/60">
                                        Comments
                                    </p>
                                </div>

                                <button type="button" onClick={handleToggleBookmark}
                                    disabled={isBookmarking}
                                    className={`col-span-3 md:col-span-1 cursor-pointer rounded-2xl bg-mist-400/30 p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-lg ${isBookmarked ? "border border-warning/40 bg-warning/10" : ""
                                        }`}
                                >
                                    <Bookmark
                                        className={isBookmarked ? "fill-warning text-warning" : "text-warning"}
                                        size={22}
                                    />

                                    <p className="mt-2 text-xl font-black text-base-content">
                                        {bookmarkCount}
                                    </p>

                                    <p className="text-xs font-semibold text-base-content/60">
                                        {isBookmarked ? "Bookmarked" : "Add Bookmark"}
                                    </p>
                                </button>
                            </div>

                            <div className="mt-7 grid gap-5">
                                <div className="rounded-[1.6rem] border border-base-300 bg-base-100/70 p-5">
                                    <div className="mb-3 flex items-center gap-2 text-primary">
                                        <Sparkles size={19} />
                                        <h2 className="text-lg font-black">Detailed Description</h2>
                                    </div>
                                    <p className="leading-7 text-base-content/70">
                                        {idea.detailedDescription}
                                    </p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="rounded-[1.6rem] border border-base-300 bg-base-100/70 p-5">
                                        <div className="mb-3 flex items-center gap-2 text-secondary">
                                            <Users size={19} />
                                            <h2 className="text-lg font-black">Target Audience</h2>
                                        </div>
                                        <p className="leading-7 text-base-content/70">
                                            {idea.targetAudience}
                                        </p>
                                    </div>

                                    <div className="rounded-[1.6rem] border border-base-300 bg-base-100/70 p-5">
                                        <div className="mb-3 flex items-center gap-2 text-success">
                                            <BadgeDollarSign size={19} />
                                            <h2 className="text-lg font-black">Estimated Budget</h2>
                                        </div>
                                        <p className="leading-7 text-base-content/70">
                                            {idea.estimatedBudget
                                                ? `$${idea.estimatedBudget}`
                                                : "Not specified"}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-[1.6rem] border border-base-300 bg-base-100/70 p-5">
                                    <div className="mb-3 flex items-center gap-2 text-error">
                                        <Target size={19} />
                                        <h2 className="text-lg font-black">Problem Statement</h2>
                                    </div>
                                    <p className="leading-7 text-base-content/70">
                                        {idea.problemStatement}
                                    </p>
                                </div>

                                <div className="rounded-[1.6rem] border border-base-300 bg-base-100/70 p-5">
                                    <div className="mb-3 flex items-center gap-2 text-accent">
                                        <Rocket size={19} />
                                        <h2 className="text-lg font-black">Proposed Solution</h2>
                                    </div>
                                    <p className="leading-7 text-base-content/70">
                                        {idea.proposedSolution}
                                    </p>
                                </div>

                                {idea.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {idea.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* Right: Comments */}
                    <aside className="rounded-[2rem] border border-base-300 bg-base-200/60 p-5 shadow-xl backdrop-blur sm:p-6 lg:sticky lg:top-28">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                                    <MessageCircle size={14} />
                                    Discussion
                                </div>

                                <h2 className="mt-3 text-2xl font-black text-base-content">
                                    Comments
                                </h2>
                            </div>

                            <span className="rounded-full bg-base-100 px-3 py-1 text-sm font-black text-base-content/70">
                                {comments.length}
                            </span>
                        </div>

                        <form onSubmit={handleAddComment} className="mb-6">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="textarea textarea-bordered min-h-28 w-full rounded-2xl"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary mt-3 w-full rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        Add Comment
                                        <Send size={17} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="space-y-4">
                            {comments.length === 0 ? (
                                <div className="rounded-[1.5rem] border border-base-300 bg-base-100/70 p-5 text-center">
                                    <MessageCircle className="mx-auto text-primary" size={34} />
                                    <p className="mt-3 text-sm font-semibold text-base-content/60">
                                        No comments yet. Be the first to discuss this idea.
                                    </p>
                                </div>
                            ) : (
                                comments.map((comment) => {
                                    const isOwner = comment.userEmail === user?.email;
                                    const isEditing = editingCommentId === comment._id;

                                    return (
                                        <div
                                            key={comment._id}
                                            className="group rounded-[1.5rem] border border-base-300 bg-base-100/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-black text-primary-content">
                                                    {comment.userImage ? (
                                                        <Image
                                                            src={comment.userImage}
                                                            alt={comment.userName || "IdeaVault User"}
                                                            height={400} width={400}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserRound size={19} />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="truncate text-sm font-black text-base-content">
                                                                {comment.userName || "IdeaVault User"}
                                                            </h3>

                                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-base-content/50">
                                                                <CalendarDays size={13} />
                                                                {formatDate(comment.createdAt)}
                                                                {comment.updatedAt && " · Edited"}
                                                            </p>
                                                        </div>

                                                        {isOwner && !isEditing && (
                                                            <div className="flex opacity-100 transition md:opacity-40 md:group-hover:opacity-100">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => startEditComment(comment)}
                                                                    className="btn btn-ghost btn-xs rounded-lg text-primary"
                                                                >
                                                                    <Edit3 size={14} />
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteComment(comment._id)
                                                                    }
                                                                    className="btn btn-ghost btn-xs rounded-lg text-error"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {isEditing ? (
                                                        <div className="mt-3">
                                                            <textarea
                                                                value={editingText}
                                                                onChange={(e) =>
                                                                    setEditingText(e.target.value)
                                                                }
                                                                className="textarea textarea-bordered min-h-20 w-full rounded-xl"
                                                            />

                                                            <div className="mt-2 flex gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleUpdateComment(comment._id)
                                                                    }
                                                                    className="btn btn-primary btn-sm rounded-xl"
                                                                >
                                                                    Save
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={cancelEditComment}
                                                                    className="btn btn-ghost btn-sm rounded-xl"
                                                                >
                                                                    <X size={15} />
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="mt-3 text-sm leading-6 text-base-content/70">
                                                            {comment.commentText}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default IdeaDetailsPage;