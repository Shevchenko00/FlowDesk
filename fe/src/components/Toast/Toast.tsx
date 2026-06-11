import styles from "./Toast.module.scss";

interface Props {
    message: string;
    type: "error" | "success";
    onClose: () => void;
}

export const Toast = ({ message, type, onClose }: Props) => (
    <div className={`${styles.toast} ${styles[type]}`}>
        <span>{message}</span>
        <button type="button" onClick={onClose}>✕</button>
    </div>
);