import { useState } from "react";
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

    const [emailError, setEmailError] = useState<string | null>(null);
    const [createdCustomer, setCreatedCustomer] = useState<any | null>(null);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleString();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === "email") {
            setEmailError(validateEmail(value));
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
                {isCustomerLoading && <p>Loading...</p>}

                {customersError && (
                    <p className={styles.errorText}>
                        {parseApiError(customersError)}
                    </p>
                )}

                {!isCustomerLoading && !customersError && customers?.length === 0 && (
                    <p>No customers yet</p>
                )}

                {customers?.map((emp: Employee) => {
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

            {isOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Add Customer</h2>
                            <button type="button" onClick={() => setIsOpen(false)}>
                                ✕
                            </button>
                        </div>

                        <div className={styles.form}>
                            <input
                                name="first_name"
                                placeholder="First Name"
                                value={form.first_name}
                                onChange={handleChange}
                                disabled={isCreated}
                            />

                            <input
                                name="last_name"
                                placeholder="Last Name"
                                value={form.last_name}
                                onChange={handleChange}
                                disabled={isCreated}
                            />

                            <input
                                name="email"
                                placeholder="Email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={isCreated}
                            />

                            {emailError && (
                                <div className={styles.error}>
                                    {emailError}
                                </div>
                            )}

                            {!isCreated ? (
                                <button onClick={handleSubmit} disabled={!canSubmit}>
                                    {isLoading ? "Creating..." : "Create"}
                                </button>
                            ) : (
                                <button onClick={resetForm}>
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
                                    <button onClick={() => copyToClipboard(createdCustomer.invite_link)}>
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