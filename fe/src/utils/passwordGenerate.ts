export const generatePassword = (length = 10): string => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    return Array.from({ length })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
};