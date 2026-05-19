"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Lightbulb, Rocket } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "/assets/startup-1.jpg",
        eyebrow: "Startup Innovation",
        title: "Turn bold ideas into real ventures.",
        description:
            "Discover startup concepts, validate possibilities, and explore ideas that can shape the next generation of products.",
    },
    {
        id: 2,
        image: "/assets/startup-2.jpg",
        eyebrow: "Idea Discovery",
        title: "Find inspiration before anyone else.",
        description:
            "Browse fresh business ideas, creative solutions, and innovation opportunities from a growing idea vault.",
    },
    {
        id: 3,
        image: "/assets/startup-3.jpg",
        eyebrow: "Build Smarter",
        title: "Connect creativity with execution.",
        description:
            "From early concepts to scalable products, explore ideas designed for founders, makers, and dreamers.",
    },
    {
        id: 4,
        image: "/assets/startup-4.jpg",
        eyebrow: "Future Ready",
        title: "Your next big startup starts here.",
        description:
            "Step into a space where innovation, technology, and ambition meet to unlock powerful possibilities.",
    },
];

const Banner = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;

        const sliderInterval = setInterval(() => {
            setActiveIndex((currentIndex) =>
                currentIndex === slides.length - 1 ? 0 : currentIndex + 1
            );
        }, 4200);

        return () => clearInterval(sliderInterval);
    }, [isPaused]);

    const activeSlide = slides[activeIndex];

    const goToPreviousSlide = () => {
        setActiveIndex((currentIndex) =>
            currentIndex === 0 ? slides.length - 1 : currentIndex - 1
        );
    };

    const goToNextSlide = () => {
        setActiveIndex((currentIndex) =>
            currentIndex === slides.length - 1 ? 0 : currentIndex + 1
        );
    };

    return (
        <section
            className="relative overflow-hidden bg-base-100 px-4 py-4 sm:px-6 md:py-10 lg:px-8 lg:py-14"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute left-0 top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid min-h-130 items-center gap-8 rounded-[2rem] border border-base-300 bg-base-200/60 p-5 shadow-xl backdrop-blur transition-all duration-500 hover:shadow-2xl sm:p-7 md:grid-cols-2 md:p-8 lg:min-h-150 lg:p-10">
                    {/* Text Content */}
                    <div key={`content-${activeSlide.id}`} className="order-2 banner-fade-up md:order-1">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary sm:text-sm">
                            <Rocket size={16} />
                            {activeSlide.eyebrow}
                        </div>

                        <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-base-content sm:text-4xl lg:text-6xl">
                            {activeSlide.title}
                        </h1>

                        <p className="mt-5 max-w-xl text-base leading-7 text-base-content/70 sm:text-lg lg:text-xl">
                            {activeSlide.description}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/ideas"
                                className="btn btn-primary rounded-xl px-8 text-base shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30"
                            >
                                Explore Ideas
                            </Link>

                            <div className="flex items-center gap-3 text-sm font-medium text-base-content/60">
                                <span className="grid h-10 w-10 place-items-center rounded-full bg-base-100 shadow-sm">
                                    <Lightbulb size={18} className="text-warning" />
                                </span>
                                Startup ideas, innovation, and execution insights
                            </div>
                        </div>

                        {/* Slider Dots */}
                        <div className="mt-8 flex items-center gap-2">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === index
                                            ? "w-9 bg-primary"
                                            : "w-2.5 bg-base-content/25 hover:bg-base-content/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="order-1 md:order-2">
                        <div className="group relative mx-auto aspect-4/3 w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-100 shadow-2xl">
                            <Image
                                key={`image-${activeSlide.id}`}
                                src={activeSlide.image}
                                alt={activeSlide.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={activeIndex === 0}
                                className="banner-zoom-fade object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-white/10 p-4 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                                    Slide {activeIndex + 1} / {slides.length}
                                </p>
                                <h3 className="mt-2 text-lg font-bold sm:text-xl">{activeSlide.eyebrow}</h3>
                            </div>

                            {/* Previous / Next Buttons */}
                            <button
                                type="button"
                                onClick={goToPreviousSlide}
                                aria-label="Previous slide"
                                className="btn btn-circle btn-sm absolute left-3 top-1/2 -translate-y-1/2 border-white/20 bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25 sm:btn-md"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                type="button"
                                onClick={goToNextSlide}
                                aria-label="Next slide"
                                className="btn btn-circle btn-sm absolute right-3 top-1/2 -translate-y-1/2 border-white/20 bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25 sm:btn-md"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div> <br /><br />
        </section>
    );
};

export default Banner;
