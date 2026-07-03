import styles from '@/pages/DashboardPage/DashboardPage.module.scss';
import {useGetPendingAllOrdersQuery} from "@/services/orderApi";

const DashboardTab = () => {
    const { data: orders, isLoading } = useGetPendingAllOrdersQuery();

    const stats = [
        {
            title: 'Pending Approval',
            value: orders?.length || 0,
        },
        {
            title: 'Awaiting Response',
            value: orders?.filter(o => o.status === 'awaiting').length || 0,
        },
        {
            title: "Today's Shoots",
            value: orders?.filter(o => o.status === 'today').length || 0,
        },
        {
            title: 'Ready for Delivery',
            value: orders?.filter(o => o.status === 'ready').length || 0,
        },
    ];

    if (isLoading) {
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