export function parseApiError(err: unknown): string {
    if (typeof err === "object" && err !== null) {
        const e = err as Record<string, unknown>;

        if (typeof e.data === "object" && e.data !== null) {
            const data = e.data as Record<string, unknown>;
            if (typeof data.detail === "string") return data.detail;
            if (typeof data.message === "string") return data.message;
            if (typeof data.error === "string") return data.error;
        }

        // RTK Query network error
        if (e.status === "FETCH_ERROR") return "Network error. Check your connection.";
        if (e.status === "PARSING_ERROR") return "Server returned unexpected response.";
        if (typeof e.status === "number") return `Server error (${e.status})`;
    }

    return "Unexpected error. Please try again.";
}