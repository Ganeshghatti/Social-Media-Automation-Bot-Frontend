import axios from "axios";
import { toast } from "sonner";

export const connectTwitter = async (workspaceId, router, token) => {
  try {
    const response = await axios.post(
      `https://api.bot.thesquirrel.tech/workspace/twitter/connect/${workspaceId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.push(response.data.data);
  } catch (error) {
    toast.error("Error in connecting twitter");
    console.error("Error connecting Twitter:", error);
  }
};

export const disconnectTwitter = async (workspaceId, userId, token) => {
  try {
    const response = await axios.post(
      `https://api.bot.thesquirrel.tech/workspace/twitter/disconnect/${workspaceId}/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Error in disconnecting twitter");

    console.error("Error disconnecting Twitter:", error);
  }
};

export const connectLinkedin = async (workspaceId, router, token) => {
  try {
    const response = await axios.post(
      `https://api.bot.thesquirrel.tech/workspace/linkedin/connect/${workspaceId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    router.push(response.data.data);
  } catch (error) {
    toast.error("Error in connecting linkedin");

    console.error("Error connecting linked in: ", error);
  }
};

export const disconnectLinkedIn = async (workspaceId, userId, token) => {
  try {
    const response = await axios.post(
      `https://api.bot.thesquirrel.tech/workspace/linkedin/disconnect/${workspaceId}/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Error in disconnecting Linkedin");

    console.error("Error disconnecting Linkedin:", error);
  }
};
