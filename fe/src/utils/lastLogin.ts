export const getLastLoginStatus = (dateString: string) => {
    const lastLogin = new Date(dateString);
    const now = new Date();

    const diffTime = now.getTime() - lastLogin.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "green";
    if (diffDays <= 3) return "yellow";
    return "red";
};