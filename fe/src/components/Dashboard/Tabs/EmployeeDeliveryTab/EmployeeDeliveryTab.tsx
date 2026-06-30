import { useState } from "react";
import styles from "./EmployeeDeliveryTab.module.scss";

import {
    useGetDeliveryMethodsQuery,
    useCreateDeliveryMethodMutation,
    useUpdateDeliveryMethodMutation,
} from "@/services/orderApi";

import { DeliveryMethod } from "@/types/order";

export const EmployeeDeliveryTab = () => {
    const { data: methods = [], isLoading } = useGetDeliveryMethodsQuery();
    const [createMethod] = useCreateDeliveryMethodMutation();
    const [updateMethod] = useUpdateDeliveryMethodMutation();

    const [selected, setSelected] = useState<DeliveryMethod | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
    });

    const openCreate = () => {
        setForm({ name: "", price: "" });
        setIsCreateOpen(true);
    };

    const openEdit = (method: DeliveryMethod) => {
        setSelected(method);
        setForm({
            name: method.name,
            price: String(method.price),
        });
    };

    const handleSave = async () => {
        if (selected) {
            await updateMethod({
                id: selected.id,
                name: form.name,
                price: Number(form.price),
            });
        } else {
            await createMethod({
                name: form.name,
                price: Number(form.price),
            });
        }

        setSelected(null);
        setIsCreateOpen(false);
    };

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
                {methods.map((m) => (
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