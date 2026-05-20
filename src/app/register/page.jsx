"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
    FaEnvelope,
    FaEye,
    FaEyeSlash,
    FaGoogle,
    FaImage,
    FaLock,
    FaUser,
} from "react-icons/fa";

const RegisterPage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [photoURL, setPhotoURL] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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

        const registerData = {
            name: name.trim(),
            email: email.trim(),
            password,
            callbackURL: "/",
        };

        if (photoURL.trim()) {
            registerData.image = photoURL.trim();
        }

        await authClient.signUp.email(registerData, {
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
        });
    };

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: "/register",
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
                    {/* Name */}
                    <label className="input input-bordered flex w-full items-center gap-3 rounded-xl">
                        <FaUser className="text-base-content/40" />
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Name"
                            className="grow"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </label>

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

                    {/* Photo URL */}
                    <label className="input input-bordered flex w-full items-center gap-3 rounded-xl">
                        <FaImage className="text-base-content/40" />
                        <input
                            id="photo"
                            name="photo"
                            type="url"
                            placeholder="Photo URL (optional)"
                            className="grow"
                            value={photoURL}
                            onChange={(e) => setPhotoURL(e.target.value)}
                            autoComplete="photo"
                        />
                    </label>

                    {/* Password */}
                    <label className="input input-bordered flex w-full items-center gap-3 rounded-xl">
                        <FaLock className="text-base-content/40" />
                        <input
                            id="password"
                            name="new-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="grow"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
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

                    <p className="text-xs leading-5 text-base-content/60">
                        Password must be at least 6 characters and include uppercase and lowercase letters.
                    </p>

                    <button
                        type="submit"
                        className="btn btn-primary w-full rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                    >
                        Register
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
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default RegisterPage;