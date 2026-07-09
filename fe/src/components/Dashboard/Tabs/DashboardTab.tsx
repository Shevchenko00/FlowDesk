import styles from '@/pages/DashboardPage/DashboardPage.module.scss';
import { useGetPendingAllOrdersQuery, useGetAllOrdersQuery } from "@/services/orderApi";
import { useGetMeQuery } from "@/services/userApi";
import { useGetCustomerQuery } from "@/services/customerApi";

const DashboardTab = () => {
    const { data: user, isLoading: isUserLoading } = useGetMeQuery();

    const isCustomer = user?.roles?.some((role) => role.name === 'customer');

    const { data: pendingOrders, isLoading: isPendingLoading } = useGetPendingAllOrdersQuery(undefined, {
        skip: isCustomer || isUserLoading,
    });

    const { data: allOrders, isLoading: isAllOrdersLoading } = useGetAllOrdersQuery(undefined, {
        skip: isCustomer || isUserLoading,
    });

    const { data: customers, isLoading: isCustomersLoading } = useGetCustomerQuery(undefined, {
        skip: isCustomer || isUserLoading,
    });

    if (isUserLoading) {
        return null;
    }

    if (isCustomer) {
        return null;
    }

    const deliveredOrders = allOrders?.filter(o => o.status === 'delivered') || [];

    const totalSales = deliveredOrders.reduce(
        (sum, order) => sum + (order.product?.price || 0) * (order.quantity || 0),
        0
    );

    const stats = [
        { title: 'Pending Approval', value: pendingOrders?.length || 0 },
        { title: 'Awaiting Response', value: pendingOrders?.filter(o => o.status === 'awaiting').length || 0 },
        { title: "Today's Shoots", value: pendingOrders?.filter(o => o.status === 'today').length || 0 },
        { title: 'Ready for Delivery', value: pendingOrders?.filter(o => o.status === 'ready').length || 0 },
        { title: 'Total Customers', value: customers?.length || 0 },
        { title: 'Total Deals', value: deliveredOrders.length },
        {
            title: 'Total Sales',
            value: totalSales.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
        },
    ];

    const isLoading = isPendingLoading || isAllOrdersLoading || isCustomersLoading;

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