import { useState, useEffect } from "react";
import styles from "./EmployeeDeliveryTab.module.scss";

import {
    useGetDeliveryMethodsQuery,
    useCreateDeliveryMethodMutation,
    useUpdateDeliveryMethodMutation,
} from "@/services/orderApi";

import { DeliveryMethod } from "@/types/order";
import { PRODUCTS_PER_PAGE } from "@/types/constraint";

export const EmployeeDeliveryTab = () => {
    const { data: methods = [], isLoading } = useGetDeliveryMethodsQuery();
    const [createMethod] = useCreateDeliveryMethodMutation();
    const [updateMethod] = useUpdateDeliveryMethodMutation();

    const [selected, setSelected] = useState<DeliveryMethod | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
        is_active: true,
    });

    const [currentPage, setCurrentPage] = useState(1);

    const openCreate = () => {
        setForm({ name: "", price: "", is_active: true });
        setIsCreateOpen(true);
    };

    const openEdit = (method: DeliveryMethod) => {
        setSelected(method);
        setForm({
            name: method.name,
            price: String(method.price),
            is_active: method.is_active,
        });
    };

    const handleSave = async () => {
        if (selected) {
            await updateMethod({
                id: selected.id,
                name: form.name,
                price: Number(form.price),
                is_active: form.is_active,
            });
        } else {
            await createMethod({
                name: form.name,
                price: Number(form.price),
                is_active: form.is_active,
            });
        }

        setSelected(null);
        setIsCreateOpen(false);
    };

    const totalPages = Math.max(
        1,
        Math.ceil(methods.length / PRODUCTS_PER_PAGE)
    );

    const paginatedMethods = methods.slice(
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
    }, [methods.length]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Delivery methods</h2>

                <button className={styles.createBtn} onClick={openCreate}>
                    + New method
                </button>
            </div>

            {isLoading && <p className={styles.infoText}>Loading...</p>}

            <div className={styles.list}>
                {paginatedMethods.map((m) => (
                    <div
                        key={m.id}
                        className={`${styles.card} ${!m.is_active ? styles.inactive : ""}`}
                    >
                        <div className={styles.topRow}>
                            <span className={styles.name}>{m.name}</span>

                            <span className={styles.price}>
                {m.price} €
              </span>
                        </div>

                        <div className={styles.footer}>
              <span className={styles.status}>
                {m.is_active ? "active" : "inactive"}
              </span>

                            <div className={styles.actions}>
                                <button onClick={() => openEdit(m)}>Edit</button>

                                <button
                                    onClick={() =>
                                        updateMethod({
                                            id: m.id,
                                            name: m.name,
                                            price: m.price,
                                            is_active: !m.is_active,
                                        })
                                    }
                                >
                                    {m.is_active ? "Disable" : "Enable"}
                                </button>
                            </div>
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
            {(isCreateOpen || selected) && (
                <div className={styles.modalOverlay} onClick={() => {
                    setIsCreateOpen(false);
                    setSelected(null);
                }}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalTop}>
                            <h2>{selected ? "Edit method" : "New method"}</h2>
                            <button onClick={() => {
                                setIsCreateOpen(false);
                                setSelected(null);
                            }}>
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <input
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                            />

                            <input
                                placeholder="Price"
                                type="number"
                                value={form.price}
                                onChange={(e) =>
                                    setForm({ ...form, price: e.target.value })
                                }
                            />
                            {selected && (
                                <label className={styles.checkboxRow}>
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) =>
                                            setForm({ ...form, is_active: e.target.checked })
                                        }
                                    />
                                    <span>Active</span>
                                </label>
                            )}
                        </div>

                        <div className={styles.modalFooter}>
                            <button onClick={handleSave}>
                                Save
                            </button>

                            <button
                                onClick={() => {
                                    setIsCreateOpen(false);
                                    setSelected(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};