export const saveJwtToken = async () => {
    try {
        const res = await fetch("/api/jwt");

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to generate token");
        }

        localStorage.setItem("ideaVaultToken", data.token);

        return data.token;
    } catch (error) {
        console.error("JWT save error:", error);
        return null;
    }
};