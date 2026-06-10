import { Tab } from "@/types/dashboard";
import DashboardTab from "./Tabs/DashboardTab";
import CustomersTab from "./Tabs/CustomersTab/CustomersTab";
import EmployeesTab from "./Tabs/EmployeesTab/EmployeesTab";
import ProductsTab from "./Tabs/ProductsTab/ProductsTab";
import SettingsTab from "./Tabs/SettingsTab";

export const tabContent: Record<Tab, React.ComponentType> = {
    Dashboard: DashboardTab,
    Customers: CustomersTab,
    Employees: EmployeesTab,
    Products: ProductsTab,
    Settings: SettingsTab,
};