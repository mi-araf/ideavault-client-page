"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowRight,
    BadgeCheck,
    Edit3,
    ImageIcon,
    Lightbulb,
    LogOut,
    Mail,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    UserRound,
    X,
} from "lucide-react";
import { TbHomeStats } from "react-icons/tb";
import { PiFinnTheHumanLight } from "react-icons/pi";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ProfilePage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [ideasCount, setIdeasCount] = useState(0);
    const [interactionsCount, setInteractionsCount] = useState(0);
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [profileImageError, setProfileImageError] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        image: "",
    });

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login?callbackURL=/profile");
        }
    }, [isPending, session, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                image: user.image || "",
            });
        }
    }, [user]);

    useEffect(() => {
        const loadStats = async () => {
            if (!user?.email) return;

            try {
                setIsStatsLoading(true);

                const [ideasRes, interactionsRes] = await Promise.all([
                    fetch(`${API_URL}/my-ideas?email=${encodeURIComponent(user.email)}`),
                    fetch(`${API_URL}/my-interactions?email=${encodeURIComponent(user.email)}`),
                ]);

                const ideasData = ideasRes.ok ? await ideasRes.json() : [];
                const interactionsData = interactionsRes.ok
                    ? await interactionsRes.json()
                    : [];

                setIdeasCount(Array.isArray(ideasData) ? ideasData.length : 0);
                setInteractionsCount(
                    Array.isArray(interactionsData) ? interactionsData.length : 0
                );
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile summary.");
            } finally {
                setIsStatsLoading(false);
            }
        };

        if (session) {
            loadStats();
        }
    }, [session, user?.email]);

    const openUpdateModal = () => {
        setFormData({
            name: user?.name || "",
            image: user?.image || "",
        });

        document.getElementById("update_profile_modal").showModal();
    };

    const closeUpdateModal = () => {
        document.getElementById("update_profile_modal").close();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Name is required.");
            return;
        }

        try {
            setIsUpdating(true);

            await authClient.updateUser(
                {
                    name: formData.name,
                    image: formData.image,
                },
                {
                    onSuccess: () => {
                        toast.success("Profile updated successfully.");
                        closeUpdateModal();
                        router.refresh();
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Failed to update profile.");
                    },
                }
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Logged out successfully.");
                    router.push("/login");
                },
                onError: () => {
                    toast.error("Logout failed.");
                },
            },
        });
    };

    const getInitials = (name, email) => {
        const source = (name || email || "User").trim();
        const words = source.split(" ").filter(Boolean);

        if (words.length >= 2) {
            return `${words[0][0]}${words[1][0]}`.toUpperCase();
        }

        return source.slice(0, 2).toUpperCase();
    };
    useEffect(() => {
        setProfileImageError(false);
    }, [user?.image]);

    if (isPending || isStatsLoading) {
        return <ProfileSkeleton />;
    }

    if (!session) return null;

    return (
        <section className="relative min-h-screen overflow-hidden bg-base-100 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
            <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="profile-slide-up">
                    <p className="text-lg font-black text-primary">
                        Hello, {user?.name || "IdeaVault User"}
                    </p>

                    <h1 className="mt-1 text-5xl font-black tracking-tight text-base-content sm:text-6xl inline-flex">
                        <PiFinnTheHumanLight className="mt-0.5" />  &nbsp;Profile
                    </h1>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
                    {/* Left Profile Card */}
                    <aside className="profile-slide-right profile-delay-1 rounded-[2.3rem] border border-base-300 bg-base-200/60 p-6 shadow-2xl backdrop-blur sm:p-8">
                        <div className="rounded-[2rem] border border-base-300 bg-base-100/80 p-6 text-center shadow-sm sm:p-8">
                            <div className="mx-auto inline-flex rounded-full bg-success/15 px-5 py-2 text-sm font-semibold text-success">
                                Active Member
                            </div>

                            <div className="relative mx-auto mt-8 h- w-50 rounded-full bg-primary/10 p-2 shadow-xl shadow-primary/10 transition duration-300 hover:scale-105 sm:h-40 sm:w-40">
                                <div className="h-full w-full overflow-hidden rounded-full border-4 border-base-100 text-gray-800">
                                    {user?.image && !profileImageError ? (
                                        <Image
                                            src={user.image}
                                            alt={user?.name || "Profile"}
                                            width={220}
                                            height={220}
                                            onError={() => setProfileImageError(true)}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="grid h-full w-full place-items-center rounded-full bg-base-300 text-5xl font-medium tracking-tight text-base-content/80">
                                            {getInitials(user?.name, user?.email)}
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-success text-success-content ring-4 ring-base-100">
                                    <BadgeCheck size={20} />
                                </div>
                            </div>

                            <h2 className="mt-6 text-3xl font-black text-base-content">
                                {user?.name || "IdeaVault User"}
                            </h2>

                            <p className="mt-2 break-all text-base text-base-content/60">
                                {user?.email}
                            </p>

                            <div className="mt-7 flex flex-col items-center gap-3">
                                <button
                                    type="button"
                                    onClick={openUpdateModal}
                                    className="btn rounded-full bg-base-200 px-7 text-primary hover:bg-primary hover:text-primary-content"
                                >
                                    <Edit3 size={17} />
                                    Update Info
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="btn btn-warning rounded-full px-8 shadow-md shadow-warning/20 transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <LogOut size={17} />
                                    Log Out
                                </button>
                            </div>
                        </div>

                    </aside>

                    {/* Right Info Panel */}
                    <main className="profile-slide-left profile-delay-2 rounded-[2.3rem] border border-base-300 bg-base-200/60 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10">
                        <h2 className="text-3xl font-black text-base-content">
                            Account Information
                        </h2>

                        <div className="mt-7 grid gap-5">
                            <InfoRow label="Name" value={user?.name || "Not provided"} />
                            <InfoRow label="Email" value={user?.email || "Not provided"} />
                            <InfoRow label="User ID" value={user?.id || "Not available"} />
                        </div>

                        <div className="mt-8 rounded-[1.8rem] border border-base-300 bg-base-100/80 p-5 sm:p-6">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-base-content">
                                        Activity Summary
                                    </h3>
                                    <p className="mt-1 text-sm text-base-content/60">
                                        Quick overview of your IdeaVault activity.
                                    </p>
                                </div>

                                <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                                    24/7 Access
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <SummaryBox
                                    icon={Lightbulb}
                                    value={ideasCount}
                                    label="Ideas"
                                    href=""
                                />

                                <SummaryBox
                                    icon={MessageCircle}
                                    value={interactionsCount}
                                    label="Interactions"
                                    href=""
                                />

                                <SummaryBox
                                    icon={TbHomeStats}
                                    value="Active"
                                    label="Status"
                                    href=""
                                />
                            </div>
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            <ActionBox
                                href="/add-idea"
                                title="Add New Idea"
                                text="Share another startup concept with the community."
                            />

                            <ActionBox
                                href="/ideas"
                                title="Explore Ideas"
                                text="Browse ideas and join more startup discussions."
                            />
                        </div>
                    </main>
                </div>
            </div>

            {/* Update Profile Modal */}
            <dialog id="update_profile_modal" className="modal">
                <div className="modal-box w-11/12 max-w-xl rounded-[2rem] border border-base-300 bg-base-100 p-0 shadow-2xl">
                    <div className="relative overflow-hidden border-b border-base-300 bg-base-200/80 px-6 py-5">
                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

                        <div className="relative flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                                    Profile
                                </p>
                                <h3 className="mt-1 text-2xl font-black text-base-content">
                                    Update Info
                                </h3>
                                <p className="mt-1 text-sm text-base-content/60">
                                    Change your display name and profile image URL.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeUpdateModal}
                                className="btn btn-ghost btn-circle"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="p-6">
                        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-base-300 bg-base-200/60 p-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ">
                                {formData?.image && !profileImageError ? (
                                    <Image
                                        src={formData.image}
                                        alt={formData?.name || "Profile"}
                                        width={220}
                                        height={220}
                                        onError={() => setProfileImageError(true)}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="grid h-full w-full place-items-center rounded-full bg-base-300 text-2xl tracking-tight text-base-content/80">
                                        {getInitials(formData?.name, formData?.email)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="font-black text-base-content">
                                    {formData.name || "Your Name"}
                                </h4>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <label className="form-control">
                                <span className="label-text mb-2 flex items-center gap-2 font-bold">
                                    <UserRound size={16} className="text-primary" />
                                    Name
                                </span>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    className="input input-bordered w-full rounded-xl"
                                    required
                                />
                            </label>

                            <label className="form-control">
                                <span className="label-text mb-2 flex items-center gap-2 font-bold">
                                    <ImageIcon size={16} className="text-primary" />
                                    Photo URL
                                </span>
                                <input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/photo.jpg"
                                    className="input input-bordered w-full rounded-xl"
                                />
                            </label>
                        </div>

                        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeUpdateModal}
                                className="btn rounded-xl"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="btn btn-primary rounded-xl px-8 shadow-lg shadow-primary/20"
                            >
                                {isUpdating ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </section>
    );
};

const InfoRow = ({ label, value }) => {
    return (
        <div className="rounded-[1.4rem] border border-base-300 bg-base-100/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-base-content/40">
                {label}
            </p>
            <p className="mt-2 break-all text-lg font-bold text-base-content/80">
                {value}
            </p>
        </div>
    );
};

const SummaryBox = ({ icon: Icon, value, label, href }) => {
    return (
        <Link
            href={href}
            className="group rounded-[1.4rem] border border-base-300 bg-base-200/50 p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:bg-base-100 hover:shadow-xl"
        >
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-content">
                <Icon size={20} />
            </div>

            <h4 className="mt-4 text-3xl font-black text-primary">
                {value}
            </h4>

            <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-base-content/40">
                {label}
            </p>
        </Link>
    );
};

const ActionBox = ({ href, title, text }) => {
    return (
        <Link
            href={href}
            className="group rounded-[1.8rem] border border-base-300 bg-base-100/80 p-5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl"
        >
            <h3 className="text-xl font-black text-base-content transition group-hover:text-primary">
                {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-base-content/60">
                {text}
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm font-black text-primary">
                Open
                <ArrowRight
                    size={17}
                    className="transition duration-300 group-hover:translate-x-1"
                />
            </div>
        </Link>
    );
};

const ProfileSkeleton = () => {
    return (
        <section className="relative min-h-screen overflow-hidden bg-base-100 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <div className="relative mx-auto max-w-7xl">
                <div className="profile-skeleton h-7 w-40 rounded-xl bg-base-200" />
                <div className="profile-skeleton mt-3 h-16 w-64 rounded-2xl bg-base-200" />

                <div className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
                    <div className="profile-skeleton h-130 rounded-[2.3rem] bg-base-200" />
                    <div className="profile-skeleton h-130 rounded-[2.3rem] bg-base-200" />
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;