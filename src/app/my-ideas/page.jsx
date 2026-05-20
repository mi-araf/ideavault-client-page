"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    Edit3,
    Lightbulb,
    Sparkles,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
    "Tech",
    "Health",
    "AI",
    "Education",
    "Finance",
    "GreenTech",
    "AgriTech",
    "FoodTech",
    "Marketplace",
    "Social Impact",
];

const emptyForm = {
    ideaTitle: "",
    shortDescription: "",
    detailedDescription: "",
    category: "Tech",
    tags: "",
    imageURL: "",
    estimatedBudget: "",
    targetAudience: "",
    problemStatement: "",
    proposedSolution: "",
};

const MyIdeasPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [deleteIdea, setDeleteIdea] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login?callbackURL=/my-ideas");
        }
    }, [isPending, session, router]);

    const loadMyIdeas = async () => {
        if (!user?.email) return;

        try {
            setIsLoading(true);
            const res = await fetch(
                `${API_URL}/my-ideas?email=${encodeURIComponent(user.email)}`
            );
            const data = await res.json();
            setIdeas(data);
        } catch (error) {
            toast.error("Failed to load your ideas.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            loadMyIdeas();
        }
    }, [session]);

    const openUpdateModal = (idea) => {
        setSelectedIdea(idea);
        setFormData({
            ideaTitle: idea.ideaTitle || "",
            shortDescription: idea.shortDescription || "",
            detailedDescription: idea.detailedDescription || "",
            category: idea.category || "Tech",
            tags: idea.tags?.join(", ") || "",
            imageURL: idea.imageURL || "",
            estimatedBudget: idea.estimatedBudget || "",
            targetAudience: idea.targetAudience || "",
            problemStatement: idea.problemStatement || "",
            proposedSolution: idea.proposedSolution || "",
        });

        document.getElementById("update_idea_modal").showModal();
    };

    const openDeleteModal = (idea) => {
        setDeleteIdea(idea);
        document.getElementById("delete_idea_modal").showModal();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleUpdateIdea = async (e) => {
        e.preventDefault();

        const updatedData = {
            ...formData,
            tags: formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            estimatedBudget: formData.estimatedBudget
                ? Number(formData.estimatedBudget)
                : null,
            creatorEmail: user?.email,
        };

        try {
            setIsUpdating(true);

            const res = await fetch(`${API_URL}/ideas/${selectedIdea._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to update idea.");
            }

            toast.success("Idea updated successfully.");
            document.getElementById("update_idea_modal").close();
            loadMyIdeas();
        } catch (error) {
            toast.error(error.message || "Failed to update idea.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteIdea = async () => {
        try {
            const res = await fetch(`${API_URL}/ideas/${deleteIdea._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    creatorEmail: user?.email,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to delete idea.");
            }

            toast.success("Idea deleted successfully.");
            document.getElementById("delete_idea_modal").close();
            loadMyIdeas();
        } catch (error) {
            toast.error(error.message || "Failed to delete idea.");
        }
    };

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

            <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
                        <Sparkles size={16} />
                        Private Dashboard
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                        My Ideas
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-base-content/70 sm:text-base">
                        Manage the startup ideas you created. Update details or delete ideas
                        you no longer want to keep.
                    </p>
                </div>

                {ideas.length === 0 ? (
                    <div className="mx-auto mt-12 max-w-xl rounded-[2rem] border border-base-300 bg-base-200/60 p-8 text-center shadow-xl">
                        <Lightbulb className="mx-auto text-primary" size={42} />
                        <h2 className="mt-4 text-2xl font-black text-base-content">
                            You have not added any ideas yet
                        </h2>
                        <p className="mt-2 text-sm text-base-content/70">
                            Start by sharing your first startup idea.
                        </p>
                        <Link href="/add-idea" className="btn btn-primary mt-6 rounded-xl">
                            Add Idea
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {ideas.map((idea) => (
                            <article
                                key={idea._id}
                                className="group flex min-h-102 flex-col overflow-hidden rounded-[2rem] border border-base-300 bg-base-200/60 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="relative h-44 overflow-hidden">
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
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                    <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-content">
                                        {idea.category}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col p-5">
                                    <h2 className="line-clamp-2 text-xl font-black text-base-content group-hover:text-primary">
                                        {idea.ideaTitle}
                                    </h2>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-base-content/70">
                                        {idea.shortDescription}
                                    </p>

                                    <div className="mt-5 rounded-2xl bg-base-100/70 p-4 text-sm text-base-content/70">
                                        <p className="line-clamp-1">
                                            <span className="font-bold">Audience:</span>{" "}
                                            {idea.targetAudience}
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-bold">Comments:</span>{" "}
                                            {idea.commentsCount || 0}
                                        </p>
                                    </div>

                                    <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
                                        <Link
                                            href={`/ideas/${idea._id}`}
                                            className="btn btn-sm rounded-xl"
                                        >
                                            View
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => openUpdateModal(idea)}
                                            className="btn btn-primary btn-sm rounded-xl"
                                        >
                                            <Edit3 size={13} /> Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => openDeleteModal(idea)}
                                            className="btn btn-error btn-sm rounded-xl text-error-content"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            {/* Update Modal */}
            <dialog id="update_idea_modal" className="modal">
                <div className="modal-box w-11/12 max-w-5xl overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-0 shadow-2xl">
                
                    <div className="relative overflow-hidden border-b border-base-300 bg-base-200/80 px-5 py-5 sm:px-7">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
                        <div className="absolute -bottom-12 left-10 h-28 w-28 rounded-full bg-secondary/20 blur-3xl" />

                        <div className="relative flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20">
                                    <Edit3 size={22} />
                                </div>
                                <h3 className="mt-1 text-2xl font-black text-base-content sm:text-3xl">
                                    Update Your Idea
                                </h3>
                            </div>

                            <button
                                type="button"
                                onClick={() => document.getElementById("update_idea_modal").close()}
                                className="btn btn-ghost btn-circle shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateIdea}>
                        
                        <div className="max-h-[68vh] overflow-y-auto px-5 py-6 sm:px-7">
                            <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
                                
                                <aside className="rounded-[1.6rem] border border-base-300 bg-base-200/60 p-5 lg:sticky lg:top-0 lg:h-fit">
                                    <div className="overflow-hidden rounded-[1.25rem] border border-base-300 bg-base-100">
                                        <div className="relative h-40">
                                            <Image
                                                src={
                                                    formData.imageURL ||
                                                    "https://images.unsplash.com/photo-1559136555-9303baea8ebd"
                                                }
                                                alt={formData.ideaTitle || "Idea preview"}
                                                height={300}
                                                width={500}
                                                className="h-full w-full object-cover"
                                            />

                                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                                            <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-content">
                                                {formData.category || "Startup"}
                                            </span>
                                        </div>

                                        <div className="p-4">
                                            <h4 className="line-clamp-2 text-lg font-black text-base-content">
                                                {formData.ideaTitle || "Untitled Idea"}
                                            </h4>

                                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-base-content/60">
                                                {formData.shortDescription || " "}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-2xl bg-primary/10 p-4">
                                        <p className="flex items-center gap-2 text-sm font-black text-primary">
                                            <Sparkles size={16} />
                                            Quick tip
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-base-content/60">
                                            Keep the title clear, audience specific, and problem statement practical.
                                        </p>
                                    </div>
                                </aside>

                                {/* Form Fields */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <label className="form-control md:col-span-2">
                                        <span className="label-text mb-2 font-bold">
                                            Idea Title
                                        </span>
                                        <input
                                            name="ideaTitle"
                                            value={formData.ideaTitle}
                                            onChange={handleChange}
                                            className="input input-bordered w-full rounded-xl bg-base-100"
                                            placeholder="Idea Title"
                                        />
                                    </label>

                                    <label className="form-control md:col-span-2">
                                        <span className="label-text mb-2 font-bold">
                                            Short Description
                                        </span>
                                        <textarea
                                            name="shortDescription"
                                            value={formData.shortDescription}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered min-h-24 rounded-xl bg-base-100"
                                            placeholder="Short Description"
                                        />
                                    </label>

                                    <label className="form-control md:col-span-2">
                                        <span className="label-text mb-2 font-bold">
                                            Detailed Description
                                        </span>
                                        <textarea
                                            name="detailedDescription"
                                            value={formData.detailedDescription}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered min-h-32 rounded-xl bg-base-100"
                                            placeholder="Detailed Description"
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2 font-bold">
                                            Category
                                        </span>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="select select-bordered w-full rounded-xl bg-base-100"
                                        >
                                            {categories.map((category) => (
                                                <option key={category}>{category}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2 font-bold">
                                            Tags
                                            <span className="ml-1 text-xs font-medium text-base-content/50">
                                                Optional
                                            </span>
                                        </span>
                                        <input
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            className="input input-bordered w-full rounded-xl bg-base-100"
                                            placeholder="AI, SaaS, Tech"
                                        />
                                    </label>

                                    <label className="form-control md:col-span-2">
                                        <span className="label-text mb-2 font-bold">
                                            Image URL
                                        </span>
                                        <input
                                            name="imageURL"
                                            value={formData.imageURL}
                                            onChange={handleChange}
                                            className="input input-bordered w-full rounded-xl bg-base-100"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2 font-bold">
                                            Estimated Budget
                                            <span className="ml-1 text-xs font-medium text-base-content/50">
                                                Optional
                                            </span>
                                        </span>
                                        <input
                                            name="estimatedBudget"
                                            value={formData.estimatedBudget}
                                            onChange={handleChange}
                                            type="number"
                                            className="input input-bordered w-full rounded-xl bg-base-100"
                                            placeholder="5000"
                                        />
                                    </label>

                                    <label className="form-control">
                                        <span className="label-text mb-2 font-bold">
                                            Target Audience
                                            <span className="ml-1 text-error">*</span>
                                        </span>
                                        <input
                                            name="targetAudience"
                                            value={formData.targetAudience}
                                            onChange={handleChange}
                                            className="input input-bordered w-full rounded-xl bg-base-100"
                                            placeholder="Students, founders, small businesses"
                                            required
                                        />
                                    </label>

                                    <label className="form-control md:col-span-2">
                                        <span className="label-text mb-2 font-bold">
                                            Problem Statement
                                        </span>
                                        <textarea
                                            name="problemStatement"
                                            value={formData.problemStatement}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered min-h-24 rounded-xl bg-base-100"
                                            placeholder="What problem does this idea solve?"
                                        />
                                    </label>

                                    <label className="form-control md:col-span-2">
                                        <span className="label-text mb-2 font-bold">
                                            Proposed Solution
                                        </span>
                                        <textarea
                                            name="proposedSolution"
                                            value={formData.proposedSolution}
                                            onChange={handleChange}
                                            className="textarea textarea-bordered min-h-24 rounded-xl bg-base-100"
                                            placeholder="How does your idea solve the problem?"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex flex-col-reverse gap-3 border-t border-base-300 bg-base-200/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                            <button
                                type="button"
                                onClick={() => document.getElementById("update_idea_modal").close()}
                                className="btn rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Delete Modal */}
            <dialog id="delete_idea_modal" className="modal">
                <div className="modal-box rounded-[2rem]">
                    <h3 className="text-2xl font-black text-base-content">
                        Delete this idea?
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-base-content/70">
                        This action cannot be undone. The idea and its related comments will
                        be removed.
                    </p>

                    <div className="modal-action">
                        <button type="button" onClick={() => document.getElementById("delete_idea_modal").close()} className="btn btn-ghost btn-circle" >
                            <X size={20} />
                        </button>

                        <button onClick={handleDeleteIdea} className="btn btn-error rounded-xl text-error-content" >
                            Delete
                        </button>
                    </div>
                </div>
            </dialog>
        </section>
    );
};

export default MyIdeasPage;