import { toast } from "sonner";


export const handleApiError = (error, defaultMessage = "An error occurred") => {
    const errorMessage =
        error.response?.data?.error?.message || defaultMessage;
    toast.error(errorMessage);
    console.error("API Error:", error);
    return errorMessage;
};
