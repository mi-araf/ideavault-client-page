"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BadgeDollarSign,
    Bookmark,
    CalendarDays,
    Filter,
    Heart,
    Lightbulb,
    MessageCircle,
    RotateCcw,
    Search,
    Sparkles,
    Target,
    X,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = [
    "All",
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

function shortText(text, length = 95) {
    if (!text) return "A fresh startup idea waiting for community validation.";
    if (text.length <= length) return text;
    return `${text.slice(0, length)}...`;
}

const IdeasPage = () => {
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const loadIdeas = async ({
        searchValue = search,
        categoryValue = category,
        fromDateValue = fromDate,
        toDateValue = toDate,
    } = {}) => {
        try {
            setIsLoading(true);

            const params = new URLSearchParams();

            if (searchValue.trim()) {
                params.append("search", searchValue.trim());
            }

            if (categoryValue && categoryValue !== "All") {
                params.append("category", categoryValue);
            }

            if (fromDateValue) {
                params.append("fromDate", fromDateValue);
            }

            if (toDateValue) {
                params.append("toDate", toDateValue);
            }

            const queryString = params.toString();
            const url = queryString
                ? `${API_URL}/ideas?${queryString}`
                : `${API_URL}/ideas`;

            const res = await fetch(url);

            if (!res.ok) {
                throw new Error("Failed to fetch ideas");
            }

            const data = await res.json();
            setIdeas(data);
        } catch (error) {
            console.error(error);
            setIdeas([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadIdeas({
            searchValue: "",
            categoryValue: "All",
            fromDateValue: "",
            toDateValue: "",
        });
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadIdeas();
    };

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);

        loadIdeas({
            categoryValue: selectedCategory,
        });

        const drawer = document.getElementById("idea-filter-drawer");
        if (drawer) drawer.checked = false;
    };

    const handleApplyDateFilter = () => {
        loadIdeas();

        const drawer = document.getElementById("idea-filter-drawer");
        if (drawer) drawer.checked = false;
    };

    const handleReset = () => {
        setSearch("");
        setCategory("All");
        setFromDate("");
        setToDate("");
        setIsSearchOpen(false);

        loadIdeas({
            searchValue: "",
            categoryValue: "All",
            fromDateValue: "",
            toDateValue: "",
        });
    };

    const hasActiveFilter = search || category !== "All" || fromDate || toDate;

    return (
        <section className="relative overflow-hidden bg-base-100 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="drawer relative mx-auto max-w-7xl">
                <input id="idea-filter-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
                            <Sparkles size={16} className="animate-caret-blink" />
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

                    {/* Minimal Toolbar */}
                    <div className="mt-10 rounded-[2rem] border border-base-300 bg-base-200/60 p-4 shadow-xl backdrop-blur sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-3">
                                <label
                                    htmlFor="idea-filter-drawer"
                                    className="btn rounded-xl bg-base-100 hover:bg-base-100"
                                >
                                    <Filter size={18} />
                                    Filter
                                </label>

                                {category !== "All" && (
                                    <span className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-black text-primary">
                                        {category}
                                    </span>
                                )}

                                {/* Mobile / Tablet Search Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="btn btn-primary rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 lg:hidden"
                                >
                                    {isSearchOpen ? <X size={18} /> : <Search size={18} />}
                                    Search
                                </button>

                                {hasActiveFilter && (
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="btn rounded-xl"
                                    >
                                        <RotateCcw size={16} />
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Desktop Search Field */}
                            <form
                                onSubmit={handleSearchSubmit}
                                className="hidden min-w-105 items-center gap-3 lg:flex"
                            >
                                <div className="relative flex-1">
                                    <Search
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                                    />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Enter idea title..."
                                        className="input input-bordered w-full rounded-xl bg-base-100 pl-12"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-xl px-6 shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
                                >
                                    <Search size={18} />
                                </button>
                            </form>

                            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-base-content/60 lg:hidden">
                                <span>
                                    Showing{" "}
                                    <span className="font-black text-primary">
                                        {ideas.length}
                                    </span>{" "}
                                    ideas
                                </span>
                            </div>

                            <div className="hidden text-sm font-semibold text-base-content/60 xl:block">
                                Showing{" "}
                                <span className="font-black text-primary">
                                    {ideas.length}
                                </span>{" "}
                                ideas
                            </div>
                        </div>

                        {/* Mobile / Tablet Search Box */}
                        {isSearchOpen && (
                            <form
                                onSubmit={handleSearchSubmit}
                                className="mt-5 flex flex-col gap-3 border-t border-base-300 pt-5 lg:hidden"
                            >
                                <div className="relative flex-1">
                                    <Search
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                                    />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Enter idea title..."
                                        className="input input-bordered w-full rounded-xl bg-base-100 pl-12 text-base"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary rounded-xl px-8"
                                >
                                    Search
                                </button>
                            </form>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map((item) => (
                                <div
                                    key={item}
                                    className="h-107 animate-pulse rounded-[2rem] border border-base-300 bg-base-200/60 shadow-xl"
                                />
                            ))}
                        </div>
                    ) : ideas.length === 0 ? (
                        <div className="mx-auto mt-12 max-w-xl rounded-[2rem] border border-base-300 bg-base-200/60 p-8 text-center shadow-xl">
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                                <Lightbulb size={30} />
                            </div>

                            <h2 className="mt-5 text-2xl font-black text-base-content">
                                No ideas found
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-base-content/70">
                                Try changing your search keyword or category filter.
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="btn rounded-xl"
                                >
                                    Reset Filters
                                </button>

                                <Link href="/add-idea" className="btn btn-primary rounded-xl">
                                    Add Idea
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
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
                                            {shortText(
                                                idea.shortDescription ||
                                                idea.detailedDescription
                                            )}
                                        </p>

                                        <div className="mt-5 grid gap-3 rounded-3xl border border-base-300 bg-base-100/70 p-4">
                                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                                <Target size={16} className="text-primary" />
                                                <span className="line-clamp-1">
                                                    {idea.targetAudience || "Startup founders"}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                                <BadgeDollarSign
                                                    size={16}
                                                    className="text-success"
                                                />
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
                                                    <MessageCircle
                                                        size={15}
                                                        className="text-primary"
                                                    />
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

                {/* Category Drawer */}
                <div className="drawer-side z-50">
                    <label
                        htmlFor="idea-filter-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>

                    <aside className="min-h-full w-80 bg-base-100 p-6 shadow-2xl sm:w-96">
                        <div className="mb-7 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                                    Ideas
                                </p>
                                <h2 className="mt-1 text-2xl font-black text-base-content">
                                    Filter
                                </h2>
                            </div>

                            <label
                                htmlFor="idea-filter-drawer"
                                className="btn btn-ghost btn-circle"
                            >
                                <X size={20} />
                            </label>
                        </div>

                        <div className="space-y-2">
                            {categories.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => handleCategoryChange(item)}
                                    className={`flex cursor-pointer w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold transition-all duration-300 ${category === item
                                        ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                                        : "bg-base-200/70 text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                        }`}
                                >
                                    <span>{item}</span>
                                    {category === item && <ArrowRight size={16} />}
                                </button>
                            ))}
                        </div>

                        <div className="my-7 h-px bg-base-300" />

                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <CalendarDays size={18} className="text-primary" />
                                <h3 className="font-black text-base-content">
                                    Date Range
                                </h3>
                            </div>

                            <div className="grid gap-3">
                                <label className="form-control">
                                    <span className="label-text mb-2 font-bold">
                                        From
                                    </span>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="input input-bordered w-full rounded-xl bg-base-100"
                                    />
                                </label>

                                <label className="form-control">
                                    <span className="label-text mb-2 font-bold">
                                        To
                                    </span>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="input input-bordered w-full rounded-xl bg-base-100"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleApplyDateFilter}
                                    className="btn btn-primary mt-2 rounded-xl"
                                >
                                    Apply Filter
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="btn rounded-xl"
                                >
                                    Reset All
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default IdeasPage;