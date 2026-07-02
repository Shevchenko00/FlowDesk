import React, {useState} from "react";
import styles from "./SettingsTab.module.scss";
import {useGetMeQuery} from "@/services/userApi";
import {useSetPasswordMutation} from "@/services/userApi";
import PrimaryButton from "@components/PrimaryButton/PrimaryButton";

export default function SettingsTab() {
    const {data: user} = useGetMeQuery();

    const [form, setForm] = useState({
        old_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [setPassword, {isLoading}] = useSetPasswordMutation();

    const handleChange = (field, value) => {
        setForm((prev) => ({...prev, [field]: value}));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async () => {
        setError("");
        setSuccess("");

        if (!form.old_password || !form.new_password || !form.confirm_password) {
            return setError("Please fill in all fields");
        }

        if (form.new_password !== form.confirm_password) {
            return setError("Passwords do not match");
        }

        if (form.new_password.length < 6) {
            return setError("Minimum 6 characters required");
        }

        try {
            await setPassword({
                old_password: form.old_password,
                new_password: form.new_password,
            }).unwrap();

            setSuccess("Password successfully changed");
            setForm({
                old_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (e) {
            setError("Failed to change password");
        }
    };

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Settings</h1>

            {/* USER INFO */}
            <div className={styles.card}>
                <b>User</b>
                <span>{user?.email}</span>
            </div>

            {/* CHANGE PASSWORD */}
            <div className={styles.card}>
                <b>Change Password</b>

                <div className={styles.field}>
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={form.old_password}
                        onChange={(e) =>
                            handleChange("old_password", e.target.value)
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={form.new_password}
                        onChange={(e) =>
                            handleChange("new_password", e.target.value)
                        }
                    />
                </div>

                <div className={styles.field}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={form.confirm_password}
                        onChange={(e) =>
                            handleChange("confirm_password", e.target.value)
                        }
                    />
                </div>

                {error && <div className={styles.errorText}>{error}</div>}
                {success && (
                    <div style={{color: "#16a34a", fontSize: 14}}>
                        {success}
                    </div>
                )}

                <div className={styles.modalFooter}>
                    <PrimaryButton
                        action={handleSubmit}
                        isDisable={isLoading}
                        text={isLoading ? "Saving..." : "Change Password"}
                    />
                </div>
            </div>
        </div>
    );

}
