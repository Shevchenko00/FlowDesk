import { useState } from "react";
import styles from "./EmployeesTab.module.scss";

const EmployeesTab = () => {
    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });

    const [generatedPassword, setGeneratedPassword] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const generatePassword = (length = 10) => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const handleSubmit = () => {
        if (!form.firstName || !form.lastName || !form.email) {
            alert("Заполни все поля");
            return;
        }

        const password = generatePassword();
        setGeneratedPassword(password);

        console.log("Employee created:", {
            ...form,
            password
        });

    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPassword);
    };

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
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2>Add Employee</h2>
                            <button onClick={() => setIsOpen(false)}>✕</button>
                        </div>

                        <div className={styles.form}>
                            <input
                                name="firstName"
                                placeholder="First Name"
                                value={form.firstName}
                                onChange={handleChange}
                            />
                            <input
                                name="lastName"
                                placeholder="Last Name"
                                value={form.lastName}
                                onChange={handleChange}
                            />
                            <input
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}
                            />

                            <button onClick={handleSubmit}>
                                Создать
                            </button>
                            {generatedPassword && (
                                <div className={styles.passwordBox}>
                                    <p>Password: {generatedPassword}</p>
                                    <button onClick={copyToClipboard}>
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