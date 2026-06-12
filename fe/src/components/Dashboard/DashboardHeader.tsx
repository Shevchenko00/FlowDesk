import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import styles from "@/pages/DashboardPage/DashboardPage.module.scss";
import PrimaryButton from "@components/PrimaryButton/PrimaryButton";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
    const { user, logout: logoutUser } = useAuth();
    const navigate = useNavigate();


    const formatDate = () => new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const [now, setNow] = useState(formatDate);

    const handleLogout = async () => {
        await logoutUser();
        navigate("/sign_in", { replace: true });
    };

    return (
        <header className={styles.header}>
            <div>
                <h1>
                    Good afternoon,{" "}
                    {user?.first_name
                        ? user.first_name.charAt(0).toUpperCase() +
                        user.first_name.slice(1)
                        : ""}
                </h1>

                <span>{now}</span>
            </div>

            <PrimaryButton text={"Logout"} action={handleLogout} />
        </header>
    );
};

export default DashboardHeader;