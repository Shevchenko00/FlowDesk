import { useState } from "react";
import styles from "./ProductsTab.module.scss";
import {
    useCreateProductMutation,
    useGetAllProductsQuery,
    useDeleteProductMutation,
} from "@/services/productApi";
import { Product } from "@/types/product";
import { Toast } from "@/components/Toast/Toast";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/parseApiError";

const BASE_URL = import.meta.env.VITE_API_URL;

interface ProductForm {
    name: string;
    count: string;
    file: File | null;
}

const ProductsTab = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [createProduct, { isLoading }] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const { data: products, isLoading: isProductsLoading, error: productsError } =
        useGetAllProductsQuery();

    const { toast, showToast, hideToast } = useToast();

    const [form, setForm] = useState<ProductForm>({
        name: "",
        count: "",
        file: null,
    });

    const resetForm = () => {
        setForm({ name: "", count: "", file: null });
        setIsOpen(false);
    };

    const saveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const saveFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setForm((prev) => ({ ...prev, file }));
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

    const canSubmit = !isLoading && form.name && form.count && form.file;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Products</h1>

            <button
                type="button"
                className={styles.addBtn}
                onClick={() => setIsOpen(true)}
            >
                + Add
            </button>

            <div className={styles.list}>
                {isProductsLoading && <p>Loading…</p>}

                {productsError && (
                    <p className={styles.errorText}>
                        {parseApiError(productsError)}
                    </p>
                )}

                {!isProductsLoading && !productsError && products?.length === 0 && (
                    <p>No products yet</p>
                )}

                {products?.map((product: Product) => (
                    <div key={product.id} className={styles.card}>
                        {product.image_path && (
                            <img
                                src={`${BASE_URL}/${product.image_path}`}
                                alt={product.name}
                                className={styles.image}
                            />
                        )}

                        <b>{product.name}</b>
                        <div>Count: {product.count}</div>

                        <button
                            type="button"
                            onClick={() => onDelete(product.id)}
                            className={styles.deleteBtn}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {isOpen && (
                <button
                    type={"button"}
                    className={styles.modalOverlay}
                    onClick={() => setIsOpen(false)}
                    onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
                    tabIndex={0}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Add Product</h2>
                            <button type="button" onClick={() => setIsOpen(false)}>
                                ✕
                            </button>
                        </div>

                        <div className={styles.form}>
                            <input
                                name="name"
                                aria-label="name"
                                placeholder="Product Name"
                                value={form.name}
                                onChange={saveChange}
                            />

                            <input
                                aria-label="count"
                                name="count"
                                placeholder="Count"
                                type="number"
                                value={form.count}
                                onChange={saveChange}
                            />

                            <input
                                name="file"
                                aria-label="add file"
                                type="file"
                                accept="image/*"
                                onChange={saveFileChange}
                            />

                            {form.file && (
                                <img
                                    src={URL.createObjectURL(form.file)}
                                    alt="preview"
                                    className={styles.preview}
                                />
                            )}

                            <button
                                onClick={onSubmit}
                                disabled={!canSubmit}
                                type={"button"}
                            >
                                {isLoading ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </div>
                </button>
            )}

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

export default ProductsTab;