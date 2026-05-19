"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";

const RegisterPage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        if (!/[A-Z]/.test(password)) {
            toast.error("Password must include at least one uppercase letter.");
            return;
        }

        if (!/[a-z]/.test(password)) {
            toast.error("Password must include at least one lowercase letter.");
            return;
        }

        await authClient.signUp.email(
            {
                name,
                email,
                password,
                image: photoURL,
                callbackURL: "/",
            },
            {
                onRequest: () => {
                    toast.loading("Creating your account...");
                },
                onSuccess: () => {
                    toast.dismiss();
                    toast.success("Registration successful!");
                    router.push("/");
                },
                onError: (ctx) => {
                    toast.dismiss();
                    toast.error(ctx.error.message || "Registration failed.");
                },
            }
        );
    };

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
        });
    };

    return (
        <section className="min-h-screen bg-base-100 px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md rounded-[2rem] border border-base-300 bg-base-200/60 p-6 shadow-xl backdrop-blur sm:p-8">
                <h1 className="text-3xl font-black text-base-content">
                    Create Account
                </h1>

                <p className="mt-2 text-sm text-base-content/70">
                    Join IdeaVault and start sharing startup ideas.
                </p>

                <form onSubmit={handleRegister} className="mt-8 space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="input input-bordered w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="url"
                        placeholder="Photo URL"
                        className="input input-bordered w-full"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
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

                    <button type="submit" className="btn btn-primary w-full rounded-xl">
                        Register
                    </button>
                </form>

                <button
                    onClick={handleGoogleLogin}
                    className="btn btn-outline mt-4 w-full rounded-xl"
                >
                    Continue with Google <FaGoogle className="ml-1 mt-0.5" />
                </button>

                <p className="mt-5 text-center text-sm text-base-content/70">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-primary">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default RegisterPage;