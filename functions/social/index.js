import axios from "axios";

export const connectTwitter = async (workspaceId, router, setWorkSpaceApiId, token) => {
    try {
        const response = await axios.post(
            `https://api.bot.thesquirrel.site/workspace/twitter/connect/${workspaceId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        router.push(response.data.data);
        setWorkSpaceApiId(workspaceId);
    } catch (error) {
        console.error("Error connecting Twitter:", error);
    }
};

export const disconnectTwitter = async (workspaceId, userId, token) => {
    try {
        const response = await axios.post(
            `https://api.bot.thesquirrel.site/workspace/twitter/disconnect/${workspaceId}/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error("Error disconnecting Twitter:", error);
    }
};

export const connectLinkedin = async (workspaceId, router, setWorkSpaceApiId, token) => {
    try {
        const response = await axios.post(
            `https://api.bot.thesquirrel.site/workspace/linkedin/connect/${workspaceId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        router.push(response.data.data);
        setWorkSpaceApiId(workspaceId);
    } catch (error) {
        console.error("Error connecting linked in: ", error);
    }
};

export const disconnectLinkedIn = async (workspaceId, userId, token) => {
    try {
        const response = await axios.post(
            `https://api.bot.thesquirrel.site/workspace/linkedin/disconnect/${workspaceId}/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.error("Error disconnecting Linkedin:", error);
    }
};