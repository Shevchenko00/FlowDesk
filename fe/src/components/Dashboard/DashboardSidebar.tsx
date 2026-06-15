// DashboardSidebar.tsx
import { Tab } from "@/types/dashboard";
import styles from '@/pages/DashboardPage/DashboardPage.module.scss';

type Props = {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    allowedTabs: Tab[];
};

const DashboardSidebar = ({ activeTab, setActiveTab, allowedTabs }: Props) => {
    return (
        <aside className={styles.sidebar}>
            <h2 className={styles.logo}>Flow Desk</h2>
            <nav>
                <ul>
                    {allowedTabs.map((tab) => (
                        <li key={tab}>
                            <button
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={activeTab === tab ? styles.active : ''}
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default DashboardSidebar;