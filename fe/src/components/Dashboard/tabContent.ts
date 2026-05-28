import { Tab } from "@/types/dashboard";
import DashboardTab from "./Tabs/DashboardTab";
import CustomersTab from "./Tabs/CustomersTab";
import EmployeesTab from "./Tabs/EmployeesTab";
import SalesTab from "./Tabs/SalesTab";
import SettingsTab from "./Tabs/SettingsTab";

export const tabContent: Record<Tab, React.ComponentType> = {
    Dashboard: DashboardTab,
    Customers: CustomersTab,
    Employees: EmployeesTab,
    Sales: SalesTab,
    Settings: SettingsTab,
};