import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.scss";

import { Tab } from "@/types/dashboard";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { tabContent } from "@/components/Dashboard/tabContent";
import { useGetMeQuery } from "@/services/userApi";

const DashboardPage: React.FC = () => {

    const [activeTab, setActiveTab] = useState<Tab>(() => {
        const saved = localStorage.getItem("activeTab");

        if (saved && saved in tabContent) {
            return saved as Tab;
        }

        return "Dashboard";
    });

    const ActiveComponent = tabContent[activeTab];

    const { isLoading } = useGetMeQuery();

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);


    if (isLoading) {
        return (
            <div className={styles.loading}>
                Loading...
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main className={styles.main}>
                {activeTab === "Dashboard" && <DashboardHeader />}
                <ActiveComponent />
            </main>
        </div>
    );
};

export default DashboardPage;