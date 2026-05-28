import { useAuth } from "@/hooks/useAuth";
import styles from '@/pages/DashboardPage/DashboardPage.module.scss';

const DashboardHeader = () => {
    const { user } = useAuth();

    return (
        <header className={styles.header}>
            <div>
                <h1>
                    Good afternoon,{' '}
                    {user?.first_name
                        ? user.first_name.charAt(0).toUpperCase() +
                        user.first_name.slice(1)
                        : ''}
                </h1>

                <span>
                    {new Date().toLocaleString(undefined, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            </div>

            <button className={styles.addBtn}>+ Add</button>
        </header>
    );
};

export default DashboardHeader;