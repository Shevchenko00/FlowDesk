import { Tab } from "@/types/dashboard";

export const ROLE_TABS: Record<string, Tab[]> = {
    admin: ["Dashboard", "Customers", "Employees", "Products", "Settings", "Orders"],
    employee: ["Dashboard", "Customers", "Products", "Settings", "Orders", "Delivery Methods"],
    customer: ["Dashboard", "Products", "Settings", "My Orders"],
};

export function getAllowedTabs(roles: { name: string }[]): Tab[] {
    const allTabs: Tab[] = ["Dashboard", "Customers", "Employees", "Products","Orders", "My Orders","Delivery Methods", "Settings",  ];

    if (!roles || roles.length === 0) return [];

    const isAdmin = roles.some(r => r.name.toLowerCase() === "admin");
    if (isAdmin) return allTabs;

    const allowed = new Set<Tab>();
    for (const role of roles) {
        const tabs = ROLE_TABS[role.name.toLowerCase()] ?? [];
        tabs.forEach(t => allowed.add(t));
    }

    return allTabs.filter(t => allowed.has(t));
}