export type PrimaryButtonProps = {
    text: string;
    action: (e: React.MouseEvent<HTMLButtonElement>) => void;
    isDisable?: boolean;
};