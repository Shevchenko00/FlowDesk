import { Header } from "@components/Header/Header";
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader } from "@components/Loader/Loader";
import PrimaryButton from "@components/PrimaryButton/PrimaryButton";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login, loginLoading, loginError, isAuth } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            console.error(err);
        }
    };

    if (loginLoading) return <Loader />;
    if (isAuth) return <Navigate to="/dashboard" />;

    return (
        <>
            <Header />
            <div className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div className={styles.loginCard}>
                        <h1 className={styles.title}>Welcome back</h1>
                        <p className={styles.subtitle}>
                            Sign in to continue managing your workspace
                        </p>

                        <form onSubmit={handleSubmit} className={styles.form}>

                            {/* EMAIL */}
                            <div className={styles.field}>
                                <label htmlFor="email" className={styles.srOnly}>
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="password" className={styles.srOnly}>
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            {loginError && (
                                <div className={styles.errorMessage}>
                                    {typeof loginError === 'object' && 'data' in loginError
                                        ? (loginError.data as { detail?: string })?.detail || 'Something went wrong'
                                        : String(loginError)}
                                </div>
                            )}

                            <PrimaryButton
                                text={"Sign In"}
                                action={handleSubmit}
                                isDisable={!email || !password}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;