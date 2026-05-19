"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    BadgeDollarSign,
    FileText,
    ImageIcon,
    Lightbulb,
    Rocket,
    Sparkles,
    Tags,
    Target,
    Users,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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

const AddIdeaPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
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
    });

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login?callbackURL=/add-idea");
        }
    }, [isPending, session, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleAddIdea = async (e) => {
        e.preventDefault();

        if (!formData.ideaTitle.trim()) {
            toast.error("Idea title is required.");
            return;
        }

        if (!formData.imageURL.trim()) {
            toast.error("Image URL is required.");
            return;
        }

        const tagsArray = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);

        const newIdea = {
            ...formData,
            tags: tagsArray,
            estimatedBudget: formData.estimatedBudget
                ? Number(formData.estimatedBudget)
                : null,
            creatorName: user?.name || "IdeaVault User",
            creatorEmail: user?.email || "",
            creatorImage: user?.image || "",
        };

        try {
            setIsSubmitting(true);

            const res = await fetch(`${API_URL}/ideas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newIdea),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Failed to add idea.");
            }

            toast.success("Idea added successfully!");

            setFormData({
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
            });

            router.push("/ideas");
        } catch (error) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPending) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </section>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
                        <Sparkles size={16} className="animate-pulse" />
                        Private Idea Submission
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                        Add your startup idea
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-base-content/70 sm:text-base">
                        Share your concept with the community and start collecting useful
                        feedback for validation.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
                    <aside className="rounded-[2rem] border border-base-300 bg-base-200/60 p-6 shadow-xl backdrop-blur lg:sticky lg:top-28">
                        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/20">
                            <Lightbulb size={27} />
                        </div>

                        <h2 className="mt-5 text-2xl font-black text-base-content">
                            What makes a good idea?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-base-content/70">
                            A strong startup idea clearly explains the problem, target users,
                            and how your solution improves their current experience.
                        </p>

                        <div className="mt-6 grid gap-3">
                            <div className="flex items-center gap-3 rounded-2xl bg-base-100/70 p-4">
                                <Target className="text-primary" size={20} />
                                <span className="text-sm font-bold text-base-content/70">
                                    Clear target audience
                                </span>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-base-100/70 p-4">
                                <Users className="text-secondary" size={20} />
                                <span className="text-sm font-bold text-base-content/70">
                                    Real user problem
                                </span>
                            </div>

                            <div className="flex items-center gap-3 rounded-2xl bg-base-100/70 p-4">
                                <Rocket className="text-accent" size={20} />
                                <span className="text-sm font-bold text-base-content/70">
                                    Practical solution
                                </span>
                            </div>
                        </div>
                    </aside>

                    <form
                        onSubmit={handleAddIdea}
                        className="rounded-[2rem] border border-base-300 bg-base-200/60 p-5 shadow-xl backdrop-blur sm:p-7 lg:p-8"
                    >
                        <div className="grid gap-5 md:grid-cols-2">
                            <label className="form-control md:col-span-2">
                                <span className="label-text mb-2 font-bold">Idea Title</span>
                                <input
                                    type="text"
                                    name="ideaTitle"
                                    value={formData.ideaTitle}
                                    onChange={handleChange}
                                    placeholder="Example: AI Resume Builder"
                                    className="input input-bordered w-full rounded-xl"
                                    required
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
                                    placeholder="Write a short summary..."
                                    className="textarea textarea-bordered min-h-24 w-full rounded-xl"
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
                                    placeholder="Explain your idea in detail..."
                                    className="textarea textarea-bordered min-h-36 w-full rounded-xl"
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text font-bold">Category</span>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="select select-bordered w-full rounded-xl"
                                    required
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2 font-bold">Tags (Optional)</span>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="AI, SaaS, productivity"
                                    className="input input-bordered w-full rounded-xl"
                                />
                            </label>

                            <label className="form-control md:col-span-2">
                                <span className="label-text mb-2 font-bold">Image URL</span>
                                <input
                                    type="url"
                                    name="imageURL"
                                    value={formData.imageURL}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    className="input input-bordered w-full rounded-xl"
                                    required
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2 font-bold">
                                    Estimated Budget (Optional)
                                </span>
                                <input
                                    type="number"
                                    name="estimatedBudget"
                                    value={formData.estimatedBudget}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    className="input input-bordered w-full rounded-xl"
                                    min="0"
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2 font-bold">Target Audience</span>
                                <input
                                    type="text"
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleChange}
                                    placeholder="Students, founders, small businesses"
                                    className="input input-bordered w-full rounded-xl"
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
                                    placeholder="What problem does this idea solve?"
                                    className="textarea textarea-bordered min-h-28 w-full rounded-xl"
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
                                    placeholder="How will your idea solve the problem?"
                                    className="textarea textarea-bordered min-h-28 w-full rounded-xl"
                                />
                            </label>
                        </div>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <FileText size={17} />
                                Your idea will be saved to the database.
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Submit Idea
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddIdeaPage;