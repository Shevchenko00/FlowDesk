import styles from '@/pages/DashboardPage/DashboardPage.module.scss';
import { useGetPendingAllOrdersQuery } from "@/services/orderApi";
import { useGetMeQuery } from "@/services/userApi"; // подставьте реальный путь/имя

const DashboardTab = () => {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();

    const isCustomer = user?.roles?.some((role) => role.name === 'customer');

    const { data: orders, isLoading: isOrdersLoading } = useGetPendingAllOrdersQuery(undefined, {
        skip: isCustomer || isUserLoading, // ждём юзера И пропускаем для customer
    });

    if (isUserLoading) {
        return null; // или спиннер, если хотите
    }

    if (isCustomer) {
        return null;
    }

    const stats = [
        { title: 'Pending Approval', value: orders?.length || 0 },
        { title: 'Awaiting Response', value: orders?.filter(o => o.status === 'awaiting').length || 0 },
        { title: "Today's Shoots", value: orders?.filter(o => o.status === 'today').length || 0 },
        { title: 'Ready for Delivery', value: orders?.filter(o => o.status === 'ready').length || 0 },
    ];

    if (isOrdersLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.stats}>
            {stats.map((item) => (
                <div key={item.title} className={styles.card}>
                    <span>{item.title}</span>
                    <h2>{item.value}</h2>
                </div>
            ))}
        </div>
    );
};

export default DashboardTab;