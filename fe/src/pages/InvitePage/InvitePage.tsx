import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./InvitePage.module.scss";
import {
    useGetInviteQuery,
    useSetPasswordInviteMutation,
} from "@/services/userApi";
import PrimaryButton from "@components/PrimaryButton/PrimaryButton";

const InvitePage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const {
        data: inviteData,
        isLoading: inviteLoading,
        isError,
    } = useGetInviteQuery(token!, {
        skip: !token,
    });

    const [setPasswordApi, { isLoading }] =
        useSetPasswordInviteMutation();

    const handleSubmit = async () => {
        if (!password || password !== confirmPassword) return;

        try {
            await setPasswordApi({
                token,
                new_password: password,
            }).unwrap();

            navigate("/dashboard");
        } catch (e) {
            console.error(e);
        }
    };

    if (inviteLoading) {
        return <div>Loading invite...</div>;
    }

    if (isError) {
        return <div>Invalid or expired invite link</div>;
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1>Welcome 👋</h1>

                <p>Account: {inviteData?.email}</p>

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

                <PrimaryButton
                    action={handleSubmit}
                    disabled={
                        !password ||
                        password !== confirmPassword ||
                        isLoading
                    }

                    text={isLoading ? "Saving..." : "Create account"}
                >
                </PrimaryButton>
            </div>
        </div>
    );
};

export default InvitePage;