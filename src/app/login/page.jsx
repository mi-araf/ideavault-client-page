"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackURL = searchParams.get("callbackURL") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        await authClient.signIn.email(
            {
                email,
                password,
                callbackURL,
                rememberMe: true,
            },
            {
                onRequest: () => {
                    toast.loading("Logging in...");
                },
                onSuccess: () => {
                    toast.dismiss();
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
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="text-right">
                        <button type="button" className="text-sm font-semibold text-primary cursor-pointer" >
                            Forgot password?
                        </button>
                    </div>

                    <button type="submit" className="btn btn-primary w-full rounded-xl  " >
                        Login
                    </button>
                </form>

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline mt-4 w-full rounded-xl"
                >
                    Continue with Google <FaGoogle className="ml-1 mt-0.5" />
                </button>

                <p className="mt-5 text-center text-sm text-base-content/70">
                    New to IdeaVault?{" "}
                    <Link href="/register" className="font-bold text-primary">
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default LoginPage;