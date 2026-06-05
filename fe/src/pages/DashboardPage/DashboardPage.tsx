import React, { useEffect, useState } from "react";
import styles from "./DashboardPage.module.scss";

import { Tab } from "@/types/dashboard";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { tabContent } from "@/components/Dashboard/tabContent";
import { useGetMeQuery } from "@/services/userApi";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    // 🔥 берем из localStorage
    const [activeTab, setActiveTab] = useState<Tab>(() => {
        const saved = localStorage.getItem("activeTab");

        if (saved && saved in tabContent) {
            return saved as Tab;
        }

        return "Dashboard";
    });

    const ActiveComponent = tabContent[activeTab];

    const { data: me, isLoading } = useGetMeQuery();

    // 🔥 сохраняем при изменении
    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    // 🔥 проверка первого входа
    useEffect(() => {
        if (!isLoading && me) {
            if (me.is_first_login || !me.last_login) {
                navigate("/set-password");
            }
        }
    }, [me, isLoading, navigate]);

    if (isLoading) return <div>Loading...</div>;

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