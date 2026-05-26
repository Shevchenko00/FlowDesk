import { Header } from "@components/Header/Header";
import styles from "./LoginPage.module.scss";
import {useState} from "react";
import {useAuth} from "@/hooks/useAuth";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const { login, loginLoading, loginError } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await login(email, password);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Header  />

        <div className={styles.pageWrapper}>

            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <h1 className={styles.title}>Welcome back</h1>
                    <p className={styles.subtitle}>
                        Sign in to continue managing your workspace
                    </p>

                    <form className={styles.form}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className={styles.input}
                            value={password}

                            onChange={(e) => setPassword(e.target.value)}

                        />

                        <button onClick={handleSubmit} className={styles.btnPrimary}>
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