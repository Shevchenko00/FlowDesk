

export const validateEmail = (value: string): string | null => {
    if (!value) return "Email is required";

    if (value.length > 254) return "Email is too long";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(value)) return "Invalid email format";

    return null;
};