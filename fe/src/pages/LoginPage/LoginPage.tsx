import { Header } from "@components/Header/Header";
import styles from "./LoginPage.module.scss";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader } from "@components/Loader/Loader";

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

                        {/* Перенесли onSubmit на форму */}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            {loginError && (
                                <div className={styles.errorMessage}>
                                    {typeof loginError === 'object' && 'data' in loginError
                                        ? (loginError.data as { detail?: string })?.detail || 'Something went wrong'
                                        : String(loginError)}
                                </div>
                            )}

                            <button
                                type="submit"
                                className={styles.btnPrimary}
                                disabled={loginLoading}
                            >
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
