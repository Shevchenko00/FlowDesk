import { useState } from "react";
import styles from "./SetPasswordPage.module.scss";
import { useNavigate } from "react-router-dom";
import { useSetPasswordMutation } from "@/services/userApi";

const SetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const [setPasswordApi, { isLoading }] = useSetPasswordMutation();

    const handleSubmit = async () => {
        if (!password || password !== confirmPassword) return;

        try {
            await setPasswordApi({
                new_password: password,
            }).unwrap();

            navigate("/dashboard");
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1>Set your password</h1>

                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    disabled={!password || password !== confirmPassword || isLoading}
                >
                    {isLoading ? "Saving..." : "Save password"}
                </button>
            </div>
        </div>
    );
};

export default SetPasswordPage;