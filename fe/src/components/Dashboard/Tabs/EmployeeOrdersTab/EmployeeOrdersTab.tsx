import { useState } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/services/orderApi";
import styles from "./EmployeeOrdersTab.module.scss";
import { Order } from "@/types/order";

export const EmployeeOrdersTab = () => {
    const { data: orders = [], isLoading } = useGetAllOrdersQuery();
    const [updateStatus] = useUpdateOrderStatusMutation();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const pendingOrders = orders.filter(o => o.status === "pending");

    const handleStatusChange = async (status: string) => {
        if (!selectedOrder) return;

        await updateStatus({
            order_id: selectedOrder.id,
            status,
        });

        setSelectedOrder(null);
    };

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>
                Orders

                {pendingOrders.length > 0 && (
                    <span className={styles.badgeDot}>
                        {pendingOrders.length} pending
                    </span>
                )}
            </h2>

            {isLoading && <p className={styles.infoText}>Loading orders...</p>}

            {!isLoading && orders.length === 0 && (
                <p className={styles.infoText}>No orders yet</p>
            )}

            <div className={styles.list}>
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className={`${styles.card} ${
                            order.status === "pending" ? styles.pending : ""
                        }`}
                    >
                        <div className={styles.topRow}>
                            <span className={styles.orderId}>
                                Order #{order.id}
                            </span>

                            <span className={`${styles.status} ${styles[order.status]}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className={styles.meta}>
                            <p>Product ID: {order.product_id}</p>
                            <p>Customer ID: {order.customer_id}</p>
                            <p>
                                Delivery: <b>{order.delivery_method.name}</b>
                            </p>
                        </div>

                        <div className={styles.footer}>
                            <span className={styles.date}>
                                {new Date(order.ordered_at).toLocaleString()}
                            </span>

                            <button
                                className={styles.processBtn}
                                onClick={() => setSelectedOrder(order)}
                            >
                                Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedOrder && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalTop}>
                            <h2>Order #{selectedOrder.id}</h2>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setSelectedOrder(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <p><b>Product ID:</b> {selectedOrder.product_id}</p>
                            <p><b>Customer ID:</b> {selectedOrder.customer_id}</p>
                            <p>
                                <b>Delivery:</b> {selectedOrder.delivery_method.name}
                            </p>
                            <p><b>Status:</b> {selectedOrder.status}</p>
                            <p>
                                <b>Date:</b>{" "}
                                {new Date(selectedOrder.ordered_at).toLocaleString()}
                            </p>
                        </div>

                        <div className={styles.modalFooter}>
                            {selectedOrder.status === "pending" && (
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => handleStatusChange("confirmed")}
                                >
                                    Confirm
                                </button>
                            )}

                            {selectedOrder.status === "confirmed" && (
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => handleStatusChange("shipped")}
                                >
                                    Ship
                                </button>
                            )}

                            {selectedOrder.status === "shipped" && (
                                <button
                                    className={styles.btnPrimary}
                                    onClick={() => handleStatusChange("delivered")}
                                >
                                    Deliver
                                </button>
                            )}

                            <button
                                className={styles.btnCancel}
                                onClick={() => setSelectedOrder(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};