"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TITLE_MAP = {
    "/": "Home | IdeaVault",
    "/add-idea": "Add New Idea | IdeaVault",
    "/bookmarks": "Your Bookmarks | IdeaVault",
    "/ideas": "Explore Ideas | IdeaVault",
    "/login": "Login | IdeaVault",
    "/register": "Register | IdeaVault",
    "/my-ideas": "My Ideas | IdeaVault",
    "/my-interactions": "My Interactions | IdeaVault",
    "/profile": "Profile | IdeaVault",
};

const getTitleForPath = (pathname) => {
    if (!pathname) return "IdeaVault";
    const trimmedPath = pathname.replace(/\/$/, "");

    if (trimmedPath.startsWith("/ideas/") && trimmedPath !== "/ideas") {
        return "Idea Details | IdeaVault";
    }

    return TITLE_MAP[trimmedPath] || "IdeaVault";
};

export default function RouteTitle() {
    const pathname = usePathname();

    useEffect(() => {
        document.title = getTitleForPath(pathname);
    }, [pathname]);

    return null;
}
