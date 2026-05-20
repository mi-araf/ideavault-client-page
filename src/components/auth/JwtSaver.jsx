"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { saveJwtToken } from "@/lib/save-jwt";

const JwtSaver = () => {
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        const token = localStorage.getItem("ideaVaultToken");

        if (!isPending && session && !token) {
            saveJwtToken();
        }

        if (!isPending && !session) {
            localStorage.removeItem("ideaVaultToken");
        }
    }, [isPending, session]);

    return null;
};

export default JwtSaver;