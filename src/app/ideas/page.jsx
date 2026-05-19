import Link from "next/link";
import {
    ArrowRight,
    BadgeDollarSign,
    Bookmark,
    Heart,
    Lightbulb,
    MessageCircle,
    Sparkles,
    Target,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getIdeas() {
    try {
        const res = await fetch(`${API_URL}/ideas`, {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch ideas");
        }

        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

function shortText(text, length = 95) {
    if (!text) return "A fresh startup idea waiting for community validation.";
    if (text.length <= length) return text;
    return `${text.slice(0, length)}...`;
}

const IdeasPage = async () => {
    const ideas = await getIdeas();

    return (
        <section className="relative overflow-hidden bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
                        <Sparkles size={16} />
                        Startup Idea Gallery
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                        Explore all startup ideas
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-base-content/70 sm:text-base">
                        Browse community-submitted startup concepts, discover new
                        opportunities, and open details to join the discussion.
                    </p>
                </div>

                {ideas.length === 0 ? (
                    <div className="mx-auto mt-12 max-w-xl rounded-[2rem] border border-base-300 bg-base-200/60 p-8 text-center shadow-xl">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                            <Lightbulb size={30} />
                        </div>

                        <h2 className="mt-5 text-2xl font-black text-base-content">
                            No ideas found
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-base-content/70">
                            Add your first startup idea and it will appear here.
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
                                className="group flex min-h-107 flex-col overflow-hidden rounded-[2rem] border border-base-300 bg-base-200/60 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={
                                            idea.imageURL ||
                                            "https://images.unsplash.com/photo-1559136555-9303baea8ebd"
                                        }
                                        height={400}
                                        width={400}
                                        alt={idea.ideaTitle || "Startup idea"}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                                    <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-content shadow-lg">
                                        {idea.category || "Startup"}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                    <h2 className="line-clamp-2 text-xl font-black leading-tight text-base-content transition group-hover:text-primary">
                                        {idea.ideaTitle}
                                    </h2>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-base-content/70">
                                        {shortText(idea.shortDescription || idea.detailedDescription)}
                                    </p>

                                    <div className="mt-5 grid gap-3 rounded-3xl border border-base-300 bg-base-100/70 p-4">
                                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                                            <Target size={16} className="text-primary" />
                                            <span className="line-clamp-1">
                                                {idea.targetAudience || "Startup founders"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                                            <BadgeDollarSign size={16} className="text-success" />
                                            <span>
                                                Budget:{" "}
                                                {idea.estimatedBudget
                                                    ? `$${idea.estimatedBudget}`
                                                    : "Not specified"}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-base-content/70">
                                            <span className="flex items-center gap-1.5">
                                                <Heart size={15} className="text-error" />
                                                {idea.likesCount || 0}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <MessageCircle size={15} className="text-primary" />
                                                {idea.commentsCount || 0}
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <Bookmark size={15} className="text-warning" />
                                                {idea.bookmarksCount || 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-5">
                                        <Link
                                            href={`/ideas/${idea._id}`}
                                            className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
                                        >
                                            View Details
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default IdeasPage;