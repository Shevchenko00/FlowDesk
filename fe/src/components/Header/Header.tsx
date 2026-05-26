import styles from './Header.module.scss';
import {useNavigate} from "react-router-dom";

type HeaderProps = {
    logo?: string;
    loginText?: string;
    onPrimaryClick?: () => void;
    primaryText?: string;
    showLogin?: boolean;
    showPrimary?: boolean;
};

export function Header({
                           logo = "FlowDesk",
                           loginText = "Login",
                           primaryText = "Get Started",

                           showLogin = false,
                           showPrimary = false,

                           onPrimaryClick,
                       }: HeaderProps) {
    const navigate = useNavigate()

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>{logo}</div>

                <div className={styles.headerRight}>
                    {showLogin && (
                        <a
                            href="/sign_in"
                            className={styles.navLink}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate("/sign_in");
                            }}
                        >
                            {loginText}
                        </a>
                    )}

                    {showPrimary && (
                        <button
                            type="button"
                            className={styles.btnPrimary}
                            onClick={onPrimaryClick}
                        >
                            {primaryText}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}