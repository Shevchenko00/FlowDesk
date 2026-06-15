// DashboardPage.tsx
import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.scss";

import { Tab } from "@/types/dashboard";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { tabContent } from "@/components/Dashboard/tabContent";
import { useGetMeQuery } from "@/services/userApi";
import { getAllowedTabs } from "@/utils/roleAccess";

const DashboardPage: React.FC = () => {
    const { data: user, isLoading } = useGetMeQuery();

    const allowedTabs = getAllowedTabs(user?.roles ?? []);

    const [activeTab, setActiveTab] = useState<Tab>(() => {
        const saved = localStorage.getItem("activeTab") as Tab | null;
        if (saved && saved in tabContent) return saved;
        return "Dashboard";
    });

    // Если после загрузки текущий таб недоступен — переключаем на первый доступный
    useEffect(() => {
        if (allowedTabs.length > 0 && !allowedTabs.includes(activeTab)) {
            setActiveTab(allowedTabs[0]);
        }
    }, [allowedTabs]);

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    if (isLoading) {
        return <div className={styles.loading}>Loading…</div>;
    }

    const ActiveComponent = tabContent[activeTab];

    return (
        <div className={styles.wrapper}>
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                allowedTabs={allowedTabs}
            />
            <main className={styles.main}>
                {activeTab === "Dashboard" && <DashboardHeader />}
                <ActiveComponent />
            </main>
        </div>
    );
};

export default DashboardPage;