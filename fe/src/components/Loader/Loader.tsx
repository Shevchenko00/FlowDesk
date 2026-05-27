import styles from './Loader.module.scss';

interface LoaderProps {
    size?: number;
}

export const Loader = ({ size = 160 }: LoaderProps) => {
    return (
        <div className={styles.wrapper}>
            <div
                className={styles.loader}
                style={{ width: size, height: size }}
            >
                <div className={styles.core}></div>

                <div className={`${styles.line} ${styles.line1}`}></div>
                <div className={`${styles.line} ${styles.line2}`}></div>
                <div className={`${styles.line} ${styles.line3}`}></div>
            </div>
        </div>
    );
};
