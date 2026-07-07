import { useState, useEffect } from "react";
import styles from "./CustomerTab.module.scss";
import {
    useCreateCustomerMutation,
    useGetCustomerQuery
} from "@/services/customerApi";
import { Employee, EmployeeForm } from "@/types/employee";
import { validateEmail } from "@utils/emailValidate";
import { getLastLoginStatus } from "@utils/lastLogin";
import { Toast } from "@/components/Toast/Toast";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/parseApiError";
import { PRODUCTS_PER_PAGE } from "@/types/constraint";

const CustomersTab = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [createCustomer, { isLoading }] = useCreateCustomerMutation();

    const { data: customers, isLoading: isCustomerLoading, error: customersError } =
        useGetCustomerQuery();

    const { toast, showToast, hideToast } = useToast();

    const [form, setForm] = useState<EmployeeForm>({
        first_name: "",
        last_name: "",
        email: ""
    });

    const [currentPage, setCurrentPage] = useState(1);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [createdCustomer, setCreatedCustomer] = useState<any | null>(null);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleString();
    };

    const saveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "email") {
            setEmailError(validateEmail(value));
        }
    };

    const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const emailValidationError = validateEmail(form.email);
        setEmailError(emailValidationError);

        if (!form.first_name || !form.last_name || !form.email) return;
        if (emailValidationError) return;

        try {
            const result = await createCustomer(form).unwrap();
            setCreatedCustomer(result);
        } catch (err) {
            showToast(parseApiError(err));
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast("Invite link copied!", "success");
        } catch {
            showToast("Failed to copy to clipboard");
        }
    };

    const resetForm = () => {
        setForm({ first_name: "", last_name: "", email: "" });
        setCreatedCustomer(null);
        setEmailError(null);
        setIsOpen(false);
    };

    const isCreated = Boolean(createdCustomer);

    const canSubmit =
        !isLoading &&
        !emailError &&
        form.first_name &&
        form.last_name &&
        form.email;

    const totalPages = Math.max(
        1,
        Math.ceil((customers?.length ?? 0) / PRODUCTS_PER_PAGE)
    );

    const paginatedCustomers = (customers ?? []).slice(
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
    }, [customers]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Customers</h1>

            <button
                type="button"
                className={styles.addBtn}
                onClick={() => setIsOpen(true)}
            >
                + Add
            </button>

            <div className={styles.list}>
                {isCustomerLoading && <p>Loading</p>}

                {customersError && (
                    <p className={styles.errorText}>
                        {parseApiError(customersError)}
                    </p>
                )}

                {!isCustomerLoading && !customersError && customers?.length === 0 && (
                    <p>No customers yet</p>
                )}

                {paginatedCustomers.map((emp: Employee) => {
                    const status = getLastLoginStatus(emp.last_login);

                    return (
                        <div key={emp.id} className={styles.card}>
                            <b>{emp.first_name} {emp.last_name}</b>
                            <div>{emp.email}</div>
                            <div className={`${styles.lastLogin} ${styles[status]}`}>
                                Last login: {formatDate(emp.last_login)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!isCustomerLoading && !customersError && totalPages > 1 && (
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

            {isOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        tabIndex={-1}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setIsOpen(false);
                        }}
                    >
                        <div className={styles.modalHeader}>
                            <h2 id="modal-title">Add Customer</h2>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.form}>
                            <input
                                name="first_name"
                                placeholder="First Name"
                                aria-label="First name"
                                value={form.first_name}
                                onChange={saveChange}
                                disabled={isCreated}
                            />

                            <input
                                name="last_name"
                                placeholder="Last Name"
                                aria-label="Last name"
                                value={form.last_name}
                                onChange={saveChange}
                                disabled={isCreated}
                            />

                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                aria-label="Email"
                                value={form.email}
                                onChange={saveChange}
                                disabled={isCreated}
                            />

                            {emailError && (
                                <div className={styles.error} role="alert">
                                    {emailError}
                                </div>
                            )}

                            {!isCreated ? (
                                <button
                                    type="button"
                                    onClick={onSubmit}
                                    disabled={!canSubmit}
                                >
                                    {isLoading ? "Creating..." : "Create"}
                                </button>
                            ) : (
                                <button type="button" onClick={resetForm}>
                                    Create Another
                                </button>
                            )}

                            {isCreated && createdCustomer && (
                                <div className={styles.passwordBox}>
                                    <p><b>Customer created successfully</b></p>
                                    <p>Email: {createdCustomer.email}</p>

                                    <p>
                                        Invite link:
                                        <br />
                                        {createdCustomer.invite_link}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(createdCustomer.invite_link)
                                        }
                                    >
                                        Copy Invite Link
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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

export default CustomersTab;