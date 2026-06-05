import { useState } from "react";
import styles from "./EmployeesTab.module.scss";
import {
    useCreateMutation,
    useGetEmployeeQuery
} from "@/services/employeeApi";

import { Employee, EmployeeForm } from "@/types/employee";
import { validateEmail } from "@utils/emailValidate";
import { generatePassword } from "@utils/passwordGenerate";
import {getLastLoginStatus} from "@utils/lastLogin";

const EmployeesTab = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [createEmployee, { isLoading }] = useCreateMutation();

    const {
        data: employees,
        isLoading: isEmployeesLoading
    } = useGetEmployeeQuery();

    const [form, setForm] = useState<EmployeeForm>({
        first_name: "",
        last_name: "",
        email: ""
    });

    const [emailError, setEmailError] = useState<string | null>(null);
    const [createdEmployee, setCreatedEmployee] =
        useState<Employee | null>(null);
    const [generatedPassword, setGeneratedPassword] = useState("");


    const formatDate = (dateString?: string) => {
        if (!dateString) return "Never";

        return new Date(dateString).toLocaleString();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === "email") {
            setEmailError(validateEmail(value));
        }
    };

    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        e.preventDefault();

        const emailValidationError = validateEmail(form.email);
        setEmailError(emailValidationError);

        if (!form.first_name || !form.last_name || !form.email) {
            return;
        }

        if (emailValidationError) return;

        const password = generatePassword();
        setGeneratedPassword(password);

        try {
            const result = await createEmployee({
                ...form,
                password
            }).unwrap();

            setCreatedEmployee(result);
        } catch (err) {
            console.error(err);
        }
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
    };

    const resetForm = () => {
        setForm({
            first_name: "",
            last_name: "",
            email: ""
        });

        setCreatedEmployee(null);
        setGeneratedPassword("");
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
                className={styles.addBtn}
                onClick={() => setIsOpen(true)}
            >
                + Add
            </button>

            <div className={styles.list}>
                <h2>Employees</h2>

                {isEmployeesLoading && <p>Loading...</p>}

                {!isEmployeesLoading && employees?.length === 0 && (
                    <p>No employees yet</p>
                )}

                {employees?.map((emp: Employee) => {
                    const status = getLastLoginStatus(emp.last_login);

                    return (
                        <div key={emp.id} className={styles.card}>
                            <b>
                                {emp.first_name} {emp.last_name}
                            </b>

                            <div>{emp.email}</div>

                            <div
                                className={`${styles.lastLogin} ${styles[status]}`}
                            >
                                Last login: {formatDate(emp.last_login)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL (без изменений) */}
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
                            <h2>Add Employee</h2>
                            <button onClick={() => setIsOpen(false)}>
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
                                <button
                                    onClick={handleSubmit}
                                    disabled={!canSubmit}
                                >
                                    {isLoading ? "Creating..." : "Create"}
                                </button>
                            ) : (
                                <button onClick={resetForm}>
                                    Create Another
                                </button>
                            )}

                            {isCreated && createdEmployee && (
                                <div className={styles.passwordBox}>
                                    <p>
                                        <b>
                                            Employee created successfully
                                        </b>
                                    </p>

                                    <p>Email: {createdEmployee.email}</p>
                                    <p>Password: {generatedPassword}</p>

                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                createdEmployee.email
                                            )
                                        }
                                    >
                                        Copy Email
                                    </button>

                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                generatedPassword
                                            )
                                        }
                                    >
                                        Copy Password
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesTab;