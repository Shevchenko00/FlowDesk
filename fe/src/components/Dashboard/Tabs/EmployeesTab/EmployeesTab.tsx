import { useState } from "react";
import styles from "./EmployeesTab.module.scss";
import {
    useCreateEmployeeMutation,
    useGetEmployeeQuery
} from "@/services/employeeApi";
import { Employee, EmployeeForm } from "@/types/employee";
import { validateEmail } from "@utils/emailValidate";
import { getLastLoginStatus } from "@utils/lastLogin";
import { Toast } from "@/components/Toast/Toast";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/parseApiError";

const EmployeesTab = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

    const { data: employees, isLoading: isEmployeesLoading, error: employeesError } =
        useGetEmployeeQuery();

    const { toast, showToast, hideToast } = useToast();

    const [form, setForm] = useState<EmployeeForm>({
        first_name: "",
        last_name: "",
        email: ""
    });

    const [emailError, setEmailError] = useState<string | null>(null);
    const [createdEmployee, setCreatedEmployee] = useState<any | null>(null);

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
            const result = await createEmployee(form).unwrap();
            setCreatedEmployee(result);
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
        setCreatedEmployee(null);
        setEmailError(null);
        setIsOpen(false);
    };

    const isCreated = Boolean(createdEmployee);

    const canSubmit =
        !isLoading &&
        !emailError &&
        form.first_name &&
        form.last_name &&
        form.email;

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Employees</h1>

            <button
                type="button"
                className={styles.addBtn}
                onClick={() => setIsOpen(true)}
            >
                + Add
            </button>

            <div className={styles.list}>
                {isEmployeesLoading && <p>Loading</p>}

                {employeesError && (
                    <p className={styles.errorText}>
                        {parseApiError(employeesError)}
                    </p>
                )}

                {!isEmployeesLoading && !employeesError && employees?.length === 0 && (
                    <p>No employees yet</p>
                )}

                {employees?.map((emp: Employee) => {
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
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        tabIndex={-1}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setIsOpen(false);
                        }}
                    >
                        <div className={styles.modalHeader}>
                            <h2 id="modal-title">Add Employee</h2>
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
                                    {isLoading ? "Creating…" : "Create"}
                                </button>
                            ) : (
                                <button type="button" onClick={resetForm}>
                                    Create Another
                                </button>
                            )}

                            {isCreated && createdEmployee && (
                                <div className={styles.passwordBox}>
                                    <p><b>Employee created successfully</b></p>
                                    <p>Email: {createdEmployee.email}</p>
                                    <p>
                                        Invite link:
                                        <br />
                                        {createdEmployee.invite_link}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            copyToClipboard(createdEmployee.invite_link)
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

export default EmployeesTab;