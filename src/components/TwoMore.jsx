import Link from "next/link";
import {
    ArrowRight,
    Lightbulb,
    MessageCircle,
    Rocket,
    Search,
    ShieldCheck,
    Sparkles,
    Target,
    Users,
} from "lucide-react";

const featureCards = [
    {
        icon: Search,
        title: "Idea Discovery",
        description:
            "Browse startup ideas from different categories and find concepts that match your interest.",
        cardClass: "bg-primary/90 text-primary-content",
        iconClass: "bg-white/20 text-white",
    },
    {
        icon: MessageCircle,
        title: "Community Feedback",
        description:
            "Users can discuss ideas through comments and help creators improve their concepts.",
        cardClass: "bg-secondary/90 text-secondary-content",
        iconClass: "bg-white/20 text-white",
    },
    {
        icon: Target,
        title: "Market Validation",
        description:
            "Understand which ideas can solve real problems before investing time and resources.",
        cardClass: "bg-accent/90 text-primary-content",
        iconClass: "bg-white/20 text-white",
    },
    {
        icon: ShieldCheck,
        title: "Founder Focused",
        description:
            "Designed for students, founders, makers, and builders who want to shape better startups.",
        cardClass: "bg-emerald-600/90 text-primary-content",
        iconClass: "bg-white/25 text-secondary-content",
    },
];

const steps = [
    {
        icon: Lightbulb,
        title: "Share Your Idea",
        description:
            "Post your startup concept with problem, solution, audience, category, and useful details.",
    },
    {
        icon: Users,
        title: "Collect Feedback",
        description:
            "Let other users discuss, comment, and help you refine your idea before execution.",
    },
    {
        icon: Rocket,
        title: "Validate Direction",
        description:
            "Understand interest, improve your concept, and prepare it for the next stage.",
    },
];

const TwoMore = () => {
    return (
        <section className="relative overflow-hidden bg-base-100 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <div className="absolute left-0 top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className=" absolute bottom-20 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl space-y-16 lg:space-y-20">
                {/* Section 1 */}
                <div>
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
                            <Sparkles size={16} className="animate-pulse" />
                            IdeaVault Highlights
                        </div>

                        <h2 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                            Built for startup idea validation
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-base-content/70 sm:text-base">
                            A simple but powerful space where users can explore ideas, share
                            feedback, and discover concepts with real potential.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {featureCards.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className={`group flex min-h-70 cursor-pointer flex-col items-center justify-center rounded-[1.8rem] p-6 text-center shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl ${feature.cardClass}`}
                                >
                                    <div
                                        className={`grid h-20 w-20 place-items-center rounded-[1.5rem] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${feature.iconClass}`}
                                    >
                                        <Icon size={34} />
                                    </div>

                                    <h3 className="mt-7 text-xl font-black">{feature.title}</h3>

                                    <p className="mt-3 text-sm leading-6 opacity-90">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div> <br />

                {/* Section 2 */}
                <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-secondary sm:text-sm">
                            <Rocket size={16} className="animate-pulse" />
                            How IdeaVault Works
                        </div>

                        <h2 className="max-w-2xl text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                            From rough concept to validated startup direction.
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-7 text-base-content/70 sm:text-lg">
                            IdeaVault helps founders, students, and makers test startup ideas
                            through community discussion before building.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/add-idea"
                                className="btn btn-primary rounded-xl px-8 text-base shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
                            >
                                Share an Idea
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                href="/ideas"
                                className="btn btn-outline rounded-xl px-8 text-base transition-all duration-300 hover:-translate-y-1"
                            >
                                Browse Ideas
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                        {steps.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <div
                                    key={step.title}
                                    className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-base-300 bg-base-200/60 p-5 shadow-xl backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 sm:p-6"
                                >
                                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-2xl transition duration-500 group-hover:bg-secondary/20" />

                                    <div className="relative flex items-start gap-4">
                                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content">
                                            <Icon size={22} />
                                        </div>

                                        <div>
                                            <span className="text-xs font-black uppercase tracking-[0.25em] text-base-content/40">
                                                Step {index + 1}
                                            </span>

                                            <h3 className="mt-2 text-lg font-black text-base-content transition group-hover:text-primary">
                                                {step.title}
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-base-content/70">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TwoMore;