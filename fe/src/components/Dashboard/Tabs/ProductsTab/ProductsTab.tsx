import { useState } from "react";
import styles from "./ProductsTab.module.scss";
import {
    useCreateProductMutation,
    useGetAllProductsQuery,
    useDeleteProductMutation,
    useUpdateProductCountMutation,
    useToggleAvailabilityMutation,
} from "@/services/productApi";
import {
    useGetDeliveryMethodsQuery,
    useCreateOrderMutation,
    DeliveryMethod,
} from "@/services/orderApi";
import { Product } from "@/types/product";
import { Toast } from "@/components/Toast/Toast";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/parseApiError";
import { useUserRole } from "@/hooks/useUserRole";

const BASE_URL = import.meta.env.VITE_API_URL;

interface ProductForm {
    name: string;
    count: string;
    file: File | null;
}

interface EditForm {
    count: string;
    is_available: boolean;
}

const ProductsTab = () => {
    const role = useUserRole();
    const [isOpen, setIsOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [editForm, setEditForm] = useState<EditForm>({ count: "", is_available: true });
    const [orderProduct, setOrderProduct] = useState<Product | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<number | null>(null);

    const [createProduct, { isLoading }] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();
    const [updateCount, { isLoading: isUpdating }] = useUpdateProductCountMutation();
    const [toggleAvailability] = useToggleAvailabilityMutation();
    const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

    const { data: products, isLoading: isProductsLoading, error: productsError } =
        useGetAllProductsQuery();

    const { data: deliveryMethods } = useGetDeliveryMethodsQuery(
        undefined,
        { skip: role !== "customer" }
    );
    const [address, setAddress] = useState<Address>({
        country: "",
        city: "",
        street: "",
        postal_code: "",
    });
    const { toast, showToast, hideToast } = useToast();

    const [form, setForm] = useState<ProductForm>({ name: "", count: "", file: null });

    const resetForm = () => {
        setForm({ name: "", count: "", file: null });
        setIsOpen(false);
    };

    const openEdit = (product: Product) => {
        setEditProduct(product);
        setEditForm({ count: String(product.count), is_available: product.is_available });
    };

    const closeEdit = () => {
        setEditProduct(null);
        setEditForm({ count: "", is_available: true });
    };

    const openOrder = (product: Product) => {
        setOrderProduct(product);
        setSelectedDelivery(null);

        setAddress({
            country: "",
            city: "",
            street: "",
            postal_code: "",
        });
    };

    const closeOrder = () => {
        setOrderProduct(null);
        setSelectedDelivery(null);
    };

    const saveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const saveFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, file: e.target.files?.[0] ?? null }));
    };

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!form.name || !form.count || !form.file) return;

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("count", form.count);
        formData.append("file", form.file);

        try {
            await createProduct(formData).unwrap();
            resetForm();
            showToast("Product created!", "success");
        } catch (err) {
            showToast(parseApiError(err));
        }
    };

    const onDelete = async (productId: number) => {
        try {
            await deleteProduct(productId).unwrap();
            showToast("Product deleted", "success");
        } catch (err) {
            showToast(parseApiError(err));
        }
    };

    const onSaveEdit = async () => {
        if (!editProduct) return;

        const newCount = parseInt(editForm.count, 10);
        if (isNaN(newCount) || newCount < 0) return;

        try {
            if (newCount !== editProduct.count) {
                await updateCount({ id: editProduct.id, count: newCount }).unwrap();
            }

            if (editForm.is_available !== editProduct.is_available && newCount > 0) {
                await toggleAvailability(editProduct.id).unwrap();
            }

            showToast("Product updated!", "success");
            closeEdit();
        } catch (err) {
            showToast(parseApiError(err));
        }
    };

    const onSubmitOrder = async () => {
        if (!orderProduct || !selectedDelivery) return;

        try {
            await createOrder({
                product_id: orderProduct.id,
                delivery_method_id: selectedDelivery,
                address,
            }).unwrap();

            showToast("Order placed!", "success");
            closeOrder();
        } catch (err) {
            showToast(parseApiError(err));
        }
    };

    const canSubmit = !isLoading && form.name && form.count && form.file;
    const canManage = role === "admin" || role === "employee";

    const editCount = parseInt(editForm.count, 10);
    const willBeUnavailable = !isNaN(editCount) && editCount === 0;
    const canSaveEdit = !isUpdating && editForm.count !== "" && !isNaN(editCount) && editCount >= 0;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Products</h1>

            {role === "admin" && (
                <button type="button" className={styles.addBtn} onClick={() => setIsOpen(true)}>
                    + Add
                </button>
            )}

            <div className={styles.list}>
                {isProductsLoading && <p>Loading…</p>}

                {productsError && (
                    <p className={styles.errorText}>{parseApiError(productsError)}</p>
                )}

                {!isProductsLoading && !productsError && products?.length === 0 && (
                    <p>No products yet</p>
                )}

                {products
                    ?.filter((p: Product) => role !== "customer" || p.is_available)
                    .map((product: Product) => (
                        <div key={product.id} className={styles.card}>
                            {product.image_path && (
                                <img
                                    src={`${BASE_URL}/${product.image_path}`}
                                    alt={product.name}
                                    className={styles.image}
                                />
                            )}

                            <b>{product.name}</b>
                            <div className={styles.countText}>Count: {product.count}</div>

                            <span className={`${styles.badge} ${product.is_available ? styles.available : styles.unavailable}`}>
                                {product.is_available ? "Available" : "Unavailable"}
                            </span>

                            {canManage && (
                                <button
                                    type="button"
                                    className={styles.editBtn}
                                    onClick={() => openEdit(product)}
                                >
                                    Edit
                                </button>
                            )}

                            {role === "admin" && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(product.id)}
                                    className={styles.deleteBtn}
                                >
                                    Delete
                                </button>
                            )}

                            {role === "customer" && (
                                <button
                                    type="button"
                                    onClick={() => openOrder(product)}
                                    className={styles.orderBtn}
                                >
                                    Order
                                </button>
                            )}
                        </div>
                    ))}
            </div>

            {/* Order modal */}
            {orderProduct && (
                <div className={styles.modalOverlay} onClick={closeOrder}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalTop}>
                            <h2>Place order</h2>
                            <button type="button" className={styles.closeBtn} onClick={closeOrder}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.productPreview}>
                                {orderProduct.image_path && (
                                    <img
                                        src={`${BASE_URL}/${orderProduct.image_path}`}
                                        alt={orderProduct.name}
                                        className={styles.previewImg}
                                    />
                                )}
                                <div>
                                    <div className={styles.previewName}>{orderProduct.name}</div>
                                    <div className={styles.countText}>In stock: {orderProduct.count}</div>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Address</label>

                                <input
                                    placeholder="Country"
                                    value={address.country}
                                    onChange={e =>
                                        setAddress(prev => ({ ...prev, country: e.target.value }))
                                    }
                                />

                                <input
                                    placeholder="City"
                                    value={address.city}
                                    onChange={e =>
                                        setAddress(prev => ({ ...prev, city: e.target.value }))
                                    }
                                />

                                <input
                                    placeholder="Street"
                                    value={address.street}
                                    onChange={e =>
                                        setAddress(prev => ({ ...prev, street: e.target.value }))
                                    }
                                />

                                <input
                                    placeholder="Postal code"
                                    value={address.postal_code}
                                    onChange={e =>
                                        setAddress(prev => ({ ...prev, postal_code: e.target.value }))
                                    }
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Delivery method</label>
                                <div className={styles.deliveryList}>
                                    {deliveryMethods?.map((method: DeliveryMethod) => (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => setSelectedDelivery(method.id)}
                                            className={`${styles.deliveryOption} ${selectedDelivery === method.id ? styles.selected : ""}`}
                                        >
                                            {method.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {!selectedDelivery && (
                                <div className={styles.warningBox}>
                                    <span>⚠</span>
                                    Please select a delivery method
                                </div>
                            )}

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={closeOrder}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnCreate}
                                    onClick={onSubmitOrder}
                                    disabled={!selectedDelivery || isOrdering}
                                >
                                    {isOrdering ? "Placing..." : "Confirm order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {editProduct && (
                <div className={styles.modalOverlay} onClick={closeEdit}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalTop}>
                            <h2>Edit product</h2>
                            <button type="button" className={styles.closeBtn} onClick={closeEdit}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.productPreview}>
                                {editProduct.image_path && (
                                    <img
                                        src={`${BASE_URL}/${editProduct.image_path}`}
                                        alt={editProduct.name}
                                        className={styles.previewImg}
                                    />
                                )}
                                <span className={styles.previewName}>{editProduct.name}</span>
                            </div>

                            <div className={styles.field}>
                                <label>Count</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={editForm.count}
                                    onChange={e => setEditForm(prev => ({ ...prev, count: e.target.value }))}
                                />
                            </div>

                            {willBeUnavailable && (
                                <div className={styles.warningBox}>
                                    <span>⚠</span>
                                    Count is 0 — product will be set to unavailable
                                </div>
                            )}

                            <div className={styles.field}>
                                <label>Availability</label>
                                <button
                                    type="button"
                                    disabled={editCount <= 0}
                                    onClick={() => setEditForm(prev => ({ ...prev, is_available: !prev.is_available }))}
                                    className={`${styles.toggleBtn} ${editForm.is_available ? styles.available : styles.unavailable}`}
                                    title={editCount <= 0 ? "Cannot enable: count is 0" : ""}
                                >
                                    {editForm.is_available ? "● Available" : "○ Unavailable"}
                                </button>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={closeEdit}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnCreate}
                                    onClick={onSaveEdit}
                                    disabled={!canSaveEdit}
                                >
                                    {isUpdating ? "Saving..." : "Save changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create modal */}
            {role === "admin" && isOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalTop}>
                            <h2>Add product</h2>
                            <button type="button" className={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.field}>
                                <label>Product name</label>
                                <input
                                    name="name"
                                    placeholder="e.g. Wireless headphones"
                                    value={form.name}
                                    onChange={saveChange}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Count</label>
                                <input
                                    name="count"
                                    placeholder="0"
                                    type="number"
                                    min={0}
                                    value={form.count}
                                    onChange={saveChange}
                                />
                            </div>

                            {form.count === "0" && (
                                <div className={styles.warningBox}>
                                    <span>⚠</span>
                                    Count is 0 — product will be created as unavailable
                                </div>
                            )}

                            <div className={styles.field}>
                                <label>Product image</label>
                                <label className={styles.uploadZone}>
                                    <span className={styles.uploadIcon}>↑</span>
                                    <p>{form.file ? form.file.name : "Click to upload image"}</p>
                                    <span>{form.file ? "" : "PNG, JPG up to 5MB"}</span>
                                    <input
                                        name="file"
                                        type="file"
                                        accept="image/*"
                                        onChange={saveFileChange}
                                        style={{ display: "none" }}
                                    />
                                </label>
                            </div>

                            {form.file && (
                                <img
                                    src={URL.createObjectURL(form.file)}
                                    alt="preview"
                                    className={styles.preview}
                                />
                            )}

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={() => setIsOpen(false)}>
                                    Cancel
                                </button>
                                <button type="button" className={styles.btnCreate} onClick={onSubmit} disabled={!canSubmit}>
                                    {isLoading ? "Creating..." : "Create product"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    );
};

export default ProductsTab;