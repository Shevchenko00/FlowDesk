import { Header } from "@components/Header/Header";
import styles from "./LoginPage.module.scss";
import {useState} from "react";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
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
                            onChange={(e) => e.target.value}
                            className={styles.input}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            className={styles.input}
                            value={password}

                            onChange={(e) => e.target.value}

                        />

                        <button type="submit" className={styles.btnPrimary}>
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