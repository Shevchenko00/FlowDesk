import { useGetMeQuery } from "@/services/userApi";

export type UserRole = "admin" | "employee" | "customer" | "guest";

export function useUserRole(): UserRole {
    const { data: user } = useGetMeQuery();

    if (!user?.roles?.length) return "guest";

    const names = user.roles.map((r: { name: string }) => r.name.toLowerCase());

    if (names.includes("admin")) return "admin";
    if (names.includes("employee")) return "employee";
    if (names.includes("customer")) return "customer";

    return "guest";
}