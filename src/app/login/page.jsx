"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaLock } from "react-icons/fa";
import { saveJwtToken } from "@/lib/save-jwt";

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackURL = searchParams.get("callbackURL") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();

        await authClient.signIn.email(
            {
                email: email.trim(),
                password,
                callbackURL,
                rememberMe: true,
            },
            {
                onRequest: () => {
                    toast.loading("Logging in...");
                },
                onSuccess: async () => {
                    toast.dismiss();
                    await saveJwtToken();
                    toast.success("Login successful!");
                    router.push(callbackURL);
                },
                onError: (ctx) => {
                    toast.dismiss();
                    toast.error(ctx.error.message || "Login failed.");
                },
            }
        );
    }

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL,
            errorCallbackURL: "/login",
        });
    };

    return (
        <section className="min-h-screen bg-base-100 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md rounded-[2rem] border border-base-300 bg-base-200/60 p-6 shadow-xl backdrop-blur sm:p-8">
                <h1 className="text-3xl font-black text-base-content">
                    Welcome Back
                </h1>

                <p className="mt-2 text-sm text-base-content/70">
                    Login to continue exploring startup ideas.
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-4">
                    {/* Email */}
                    <label className="input input-bordered flex w-full items-center gap-3 rounded-xl">
                        <FaEnvelope className="text-base-content/40" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="grow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </label>

                    {/* Password */}
                    <label className="input input-bordered flex w-full items-center gap-3 rounded-xl">
                        <FaLock className="text-base-content/40" />
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="grow"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="text-base-content/50 transition hover:text-primary"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </label>

                    <div className="text-right">
                        <button
                            type="button"
                            className="cursor-pointer text-sm font-semibold text-primary transition hover:text-primary/80 hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                    >
                        Login
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="btn btn-outline mt-4 w-full rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                    Continue with Google <FaGoogle className="ml-1 mt-0.5" />
                </button>

                <p className="mt-5 text-center text-sm text-base-content/70">
                    New to IdeaVault?{" "}
                    <Link href="/register" className="font-bold text-primary hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default LoginPage;