import { useState, useCallback } from "react";

export interface ToastState {
    message: string;
    type: "error" | "success";
}

export function useToast() {
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = useCallback((message: string, type: ToastState["type"] = "error") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const hideToast = useCallback(() => setToast(null), []);

    return { toast, showToast, hideToast };
}