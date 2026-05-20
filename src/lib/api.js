export const getAuthHeaders = () => {
    const token = localStorage.getItem("ideaVaultToken");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const getAuthOnlyHeaders = () => {
    const token = localStorage.getItem("ideaVaultToken");

    return {
        Authorization: `Bearer ${token}`,
    };
};