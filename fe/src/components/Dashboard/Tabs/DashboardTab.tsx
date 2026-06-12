import styles from '@/pages/DashboardPage/DashboardPage.module.scss';

const stats = [
    { title: 'New requests', value: 37 },
    { title: 'Awaiting response', value: 60 },
    { title: 'Today’s shoots', value: 4 },
    { title: 'Ready for delivery', value: 40 },
];


const DashboardTab = () => {
    return (
        <>
            <div className={styles.stats}>
                {stats.map((item) => (
                    <div key={item.title} className={styles.card}>
                        <span>{item.title}</span>
                        <h2>{item.value}</h2>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DashboardTab;