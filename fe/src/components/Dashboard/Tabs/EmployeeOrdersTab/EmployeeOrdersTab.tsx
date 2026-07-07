import { useState, useEffect } from "react";
import { Order, useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/services/orderApi";
import { OrderStatus } from "@/types/order";
import styles from "./EmployeeOrdersTab.module.scss";
import { PRODUCTS_PER_PAGE } from "@/types/constraint";

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    shipped: "Shipped",
    delivered: "Delivered",
    canceled: "Canceled",
};

const formatDate = (value?: string | null) =>
    value ? new Date(value).toLocaleString() : "—";

export const EmployeeOrdersTab = () => {
    const { data: orders = [], isLoading } = useGetAllOrdersQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const pendingOrders = orders.filter(o => o.status === "pending");

    const isFinal = (order: Order) =>
        order.status === "delivered" || order.status === "canceled";

    const handleStatusChange = async (status: OrderStatus) => {
        if (!selectedOrder) return;

        await updateStatus({
            order_id: selectedOrder.id,
            status,
        });

        setSelectedOrder(null);
    };

    const totalPages = Math.max(
        1,
        Math.ceil(orders.length / PRODUCTS_PER_PAGE)
    );

    const paginatedOrders = orders.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    const goToPage = (page: number) => {
        setCurrentPage(prev => {
            const next = Math.min(Math.max(1, page), totalPages);
            return next;
        });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [orders.length]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

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
                {paginatedOrders.map((order) => (
                    <div
                        key={order.id}
                        className={`${styles.card} ${
                            order.status === "pending" ? styles.pending : ""
                        } ${order.status === "canceled" ? styles.canceled : ""}`}
                    >
                        <div className={styles.topRow}>
                            <span className={styles.orderId}>
                                Order #{order.id}
                            </span>

                            <span className={`${styles.status} ${styles[order.status]}`}>
                                {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
                            </span>
                        </div>

                        <div className={styles.meta}>
                            <p>Product: <b>{order.product.name}</b> × {order.quantity}</p>
                            <p>Customer: <b>{order.customer.first_name} {order.customer.last_name}</b></p>
                            <p>
                                Delivery: <b>{order.delivery_method.name}</b>
                            </p>
                        </div>

                        <div className={styles.footer}>
                            <span className={styles.date}>
                                {formatDate(order.ordered_at)}
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

            {!isLoading && totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        ‹ Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            type="button"
                            className={`${styles.pageBtn} ${currentPage === page ? styles.pageActive : ""}`}
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        className={styles.pageBtn}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next ›
                    </button>
                </div>
            )}

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
                            <p><b>Product:</b> {selectedOrder.product.name}</p>
                            <p><b>Quantity:</b> {selectedOrder.quantity}</p>
                            <p>
                                <b>Delivery method:</b> {selectedOrder.delivery_method.name}
                                {!selectedOrder.delivery_method.is_active && (
                                    <span className={styles.inactiveTag}> (inactive)</span>
                                )}
                            </p>
                            <p>
                                <b>Status:</b>{" "}
                                <span className={`${styles.statusInline} ${styles[selectedOrder.status]}`}>
                                    {STATUS_LABELS[selectedOrder.status as OrderStatus] ?? selectedOrder.status}
                                </span>
                            </p>
                            <p>
                                <b>Ordered:</b> {formatDate(selectedOrder.ordered_at)}
                            </p>

                            {selectedOrder.status === "canceled" && (
                                <p className={styles.canceledNote}>
                                    This order has been canceled and can no longer be modified.
                                </p>
                            )}

                            <div className={styles.divider} />

                            <p className={styles.sectionLabel}>Customer</p>

                            <p>
                                <b>Name:</b>{" "}
                                {selectedOrder.customer.first_name} {selectedOrder.customer.last_name}
                            </p>
                            <p><b>Email:</b> {selectedOrder.customer.email}</p>

                            <div className={styles.divider} />

                            <p className={styles.sectionLabel}>Delivery address</p>

                            {selectedOrder.customer.street ? (
                                <div className={styles.addressBlock}>
                                    <p>{selectedOrder.customer.street}</p>
                                    <p>
                                        {selectedOrder.customer.city}, {selectedOrder.customer.postal_code}
                                    </p>
                                    <p>{selectedOrder.customer.country}</p>
                                </div>
                            ) : (
                                <p className={styles.infoText}>No address on file</p>
                            )}

                            <div className={styles.divider} />

                            <p className={styles.sectionLabel}>Processing details</p>

                            <p>
                                <b>Handled by:</b>{" "}
                                {selectedOrder.processed_by
                                    ? selectedOrder.processed_by.name
                                    : "Not yet assigned"}
                            </p>

                            <div className={styles.timeline}>
                                <div className={styles.timelineRow}>
                                    <span>Order placed</span>
                                    <span>{formatDate(selectedOrder.created_at)}</span>
                                </div>
                                <div className={styles.timelineRow}>
                                    <span>Last update</span>
                                    <span>{formatDate(selectedOrder.updated_at)}</span>
                                </div>
                            </div>

                            {selectedOrder.is_successful !== null && (
                                <p>
                                    <b>Outcome:</b>{" "}
                                    {selectedOrder.is_successful ? "Successful" : "Unsuccessful"}
                                </p>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            {!isFinal(selectedOrder) && (
                                <>
                                    {selectedOrder.status === "pending" && (
                                        <button
                                            className={styles.btnPrimary}
                                            onClick={() => handleStatusChange("confirmed")}
                                            disabled={isUpdating}
                                        >
                                            Confirm
                                        </button>
                                    )}

                                    {selectedOrder.status === "confirmed" && (
                                        <button
                                            className={styles.btnPrimary}
                                            onClick={() => handleStatusChange("shipped")}
                                            disabled={isUpdating}
                                        >
                                            Ship
                                        </button>
                                    )}

                                    {selectedOrder.status === "shipped" && (
                                        <button
                                            className={styles.btnPrimary}
                                            onClick={() => handleStatusChange("delivered")}
                                            disabled={isUpdating}
                                        >
                                            Deliver
                                        </button>
                                    )}

                                    <button
                                        className={styles.btnDanger}
                                        onClick={() => handleStatusChange("canceled")}
                                        disabled={isUpdating}
                                    >
                                        Cancel order
                                    </button>
                                </>
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