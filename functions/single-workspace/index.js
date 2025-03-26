import { toast } from "sonner";

export const deleteWorkspace = async (workspaceId, router, token) => {
    if (!token) return;

    try {
        const response = await axios.delete(
            `https://api.bot.thesquirrel.site/workspace/delete/${workspaceId}`, // FIXED DELETE ENDPOINT
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("message", response.data.message);

        if (response.data.success) {
            router.push("/workspaces");
        }
    } catch (error) {
        toast.error("Error in deleting wprkspace");

        console.error("Error deleting workspace:", error);
    }
};