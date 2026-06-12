import style from "./PrimaryButton.module.scss";
import {PrimaryButtonProps} from "@/types/primaryButton";



const PrimaryButton = ({ text, action, isDisable }: PrimaryButtonProps) => {
    return (
        <button
            type="button"
            disabled={isDisable}
            className={style.primaryBtn}
            onClick={action}
        >
            {text}
        </button>
    );
};

export default PrimaryButton;