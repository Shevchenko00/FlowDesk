import React, { useState } from 'react';
import styles from './DashboardPage.module.scss';

import { Tab } from "@/types/dashboard";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import { tabContent } from "@/components/Dashboard/tabContent";

const DashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('Dashboard');

    const ActiveComponent = tabContent[activeTab];

    return (
        <div className={styles.wrapper}>
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <main className={styles.main}>
                {activeTab === 'Dashboard' && <DashboardHeader />}
                <ActiveComponent />
            </main>
        </div>
    );
};

export default DashboardPage;