import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./InvitePage.module.scss";
import {
    useGetInviteQuery,
    useSetPasswordInviteMutation,
} from "@/services/userApi";
import PrimaryButton from "@components/PrimaryButton/PrimaryButton";
import { Toast } from "@/components/Toast/Toast";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/parseApiError";

export const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

const InvitePage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { toast, showToast, hideToast } = useToast();

    const {
        data: inviteData,
        isLoading: inviteLoading,
        isError,
    } = useGetInviteQuery(token!, { skip: !token });

    const [setPasswordApi, { isLoading }] = useSetPasswordInviteMutation();

    const handleSubmit = async () => {
        if (!password) {
            showToast("Please enter a password");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match");
            return;
        }

        try {
            await setPasswordApi({ token, new_password: password }).unwrap();
            navigate("/dashboard");
        } catch (e) {
            showToast(parseApiError(e));
        }
    };

    if (inviteLoading) return <div>Loading invite…</div>;
    if (isError) return <div>Invalid or expired invite link</div>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1>Welcome 👋</h1>

                <p>Account: {inviteData?.email}</p>

                <div className={styles.inputWrap}>
                    <input
                        aria-label="new password"
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <EyeIcon open={showPassword} />
                    </button>
                </div>

                <div className={styles.inputWrap}>
                    <input
                        aria-label={"password"}
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className={styles.eyeBtn}
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                        <EyeIcon open={showConfirm} />
                    </button>
                </div>

                {confirmPassword && password !== confirmPassword && (
                    <p className={styles.fieldError}>Passwords do not match</p>
                )}

                <PrimaryButton
                    action={handleSubmit}
                    disabled={!password || password !== confirmPassword || isLoading}
                    text={isLoading ? "Saving..." : "Create account"}
                />
            </div>

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

export default InvitePage;