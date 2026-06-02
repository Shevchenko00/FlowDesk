import { useState } from "react";
import styles from "./EmployeesTab.module.scss";
import { useCreateMutation } from "@/services/employeeApi";
import {Employee, EmployeeForm} from "@/types/employee";

const EmployeesTab = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [createEmployee, { isLoading }] = useCreateMutation();

    const [form, setForm] = useState<EmployeeForm>({
        first_name: "",
        last_name: "",
        email: ""
    });

    const [createdEmployee, setCreatedEmployee] = useState<Employee | null>(null);
    const [generatedPassword, setGeneratedPassword] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const generatePassword = (length: number = 10): string => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

        return Array.from({ length })
            .map(() =>
                chars.charAt(Math.floor(Math.random() * chars.length))
            )
            .join("");
    };

    const handleSubmit = async (
        e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        e.preventDefault();

        if (!form.first_name || !form.last_name || !form.email) {
            alert("Заполни все поля");
            return;
        }

        const password: string = generatePassword();
        setGeneratedPassword(password);

        try {
            const result = await createEmployee({
                ...form,
                password
            }).unwrap();

            setCreatedEmployee(result);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const copyToClipboard = async (text: string): Promise<void> => {
        await navigator.clipboard.writeText(text);
    };

    const resetForm = (): void => {
        setForm({
            first_name: "",
            last_name: "",
            email: ""
        });

        setCreatedEmployee(null);
        setGeneratedPassword("");
    };

    const isCreated: boolean = Boolean(createdEmployee);

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Employees</h1>

            <button
                className={styles.addBtn}
                onClick={() => setIsOpen(true)}
            >
                + Add
            </button>

            {isOpen && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className={styles.modal}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                            e.stopPropagation()
                        }
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
                                value={form.email}
                                onChange={handleChange}
                                disabled={isCreated}
                            />

                            {!isCreated ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
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
                                        <b>Employee created successfully</b>
                                    </p>

                                    <p>
                                        Email: {createdEmployee.email}
                                    </p>

                                    <p>
                                        Password: {generatedPassword}
                                    </p>

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