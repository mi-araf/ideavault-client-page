import Link from "next/link";

const NotFound = () => {
    return (
        <section className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-base-100 px-4 py-16 text-base-content sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                    {/* <div className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                        404 Error
                    </div> */}

                    <h1 className="text-7xl font-black tracking-tight text-primary sm:text-8xl md:text-9xl">
                        404
                    </h1>

                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                        Idea Not Found
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-base-content/70 sm:text-lg lg:mx-0">
                        The page you are looking for does not exist, was moved, or may have been locked away inside the wrong vault.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                        <Link href="/" className="btn btn-primary rounded-xl px-8">
                            Back to Home
                        </Link>
                        <Link href="/ideas" className="btn btn-outline rounded-xl px-8">
                            Explore Ideas
                        </Link>
                    </div>
                </div>

                {/* Right Illustration */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/20 via-secondary/20 to-accent/20 blur-3xl" />

                    <div className="relative overflow-hidden rounded-[2rem] border border-base-300 bg-base-200/70 p-8 shadow-2xl backdrop-blur">
                        <div className="mb-6 flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-error" />
                            <span className="h-3 w-3 rounded-full bg-warning" />
                            <span className="h-3 w-3 rounded-full bg-success" />
                        </div>

                        <div className="rounded-2xl bg-base-100 p-6 shadow-inner">
                            <h2 className="mx-auto bg-linear-to-r from-cyan-500 via-fuchsia-500 to-amber-500 bg-clip-text font-black tracking-tight text-transparent text-4xl">
                                    IdeaVault
                            </h2>

                            <div className="mt-8 space-y-3">
                                <div className="h-4 w-3/4 rounded-full bg-base-300" />
                                <div className="h-4 w-full rounded-full bg-base-300" />
                                <div className="h-4 w-2/3 rounded-full bg-base-300" />
                            </div>

                            <div className="mt-8 rounded-2xl border border-dashed border-primary/40 bg-primary/10 p-5 text-center">
                                <p className="text-sm font-semibold text-primary">IDEAVAULT</p>
                                <p className="mt-1 text-xs text-base-content/60">This route has no saved idea.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NotFound;
