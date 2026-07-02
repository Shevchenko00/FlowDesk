import { useEffect, useState } from "react";
import { Tab } from "@/types/dashboard";
import styles from '@/pages/DashboardPage/DashboardPage.module.scss';

type Props = {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    allowedTabs: Tab[];
};

const DashboardSidebar = ({ activeTab, setActiveTab, allowedTabs }: Props) => {
    const [navOpen, setNavOpen] = useState(false);

    const handleSelect = (tab: Tab) => {
        setActiveTab(tab);
        setNavOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setNavOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <aside className={`${styles.sidebar} ${navOpen ? styles.navOpen : ''}`}>
            <div className={styles.sidebarTop}>
                <h2 className={styles.logo}>Flow Desk</h2>

                <button
                    type="button"
                    className={`${styles.burgerBtn} ${navOpen ? styles.burgerOpen : ''}`}
                    onClick={() => setNavOpen((prev) => !prev)}
                    aria-label={navOpen ? 'Закрыть меню' : 'Открыть меню'}
                    aria-expanded={navOpen}
                >
                    <span />
                </button>
            </div>

            <nav>
                <ul>
                    {allowedTabs.map((tab) => (
                        <li key={tab}>
                            <button
                                type="button"
                                onClick={() => handleSelect(tab)}
                                className={activeTab === tab ? styles.active : ''}
                                aria-current={activeTab === tab ? 'page' : undefined}
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