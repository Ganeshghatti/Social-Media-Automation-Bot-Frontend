"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

import { CreatePostCard } from "@components/CreatePost/CreatePostCard";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import { ButtonsHeader } from "@components/CreatePost/ButtonsHeader";
import { DraftPosts } from "@components/CreatePost/DraftPosts";
import { toast } from "sonner";

import useAuthToken from "@hooks/useAuthToken";
import { useUserStore } from "@/store/userStore";
import { notFound, useParams, useRouter } from "next/navigation";

import { Form } from "@components/ui/form";
import axios from "axios";
import { DateTime } from "luxon"; // Install: npm install luxon
import { CustomLoader } from "@/components/global/CustomLoader";

const WorkspacePage = () => {
  const { workspaceId } = useParams();
  const router = useRouter();
  const token = useAuthToken();
  const [accountId, setAccountId] = useState();
  const { user, fetchUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [singleWorkspace, setSingleWorkspace] = useState(null);
  const [postType, setPostType] = useState("post");
  const [cards, setCards] = useState([{ id: 0, text: "" }]);
  const textAreaRefs = useRef([]); // Refs for all textareas
  const [newCardAdded, setNewCardAdded] = useState(false); // Track new card addition
  const [activeButtons, setActiveButtons] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [threadIdForEdit, setThreadIdForEdit] = useState("");
  const [draftPosts, setDraftPosts] = useState([]);
  const [draftLoading, setDraftLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUser(token); // Pass token as parameter
    }
  }, [token, fetchUser]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        setCards((prev) => [...prev, { id: prev.length, text: "" }]);
        setNewCardAdded(true); // Set to true when a new card is added
      }
      if (cards.length > 1) setPostType("thread");

      if (e.ctrlKey && e.key === "Backspace") {
        setCards((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
        if (cards.length <= 1) setPostType("post");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [cards]);

  useEffect(() => {
    if (newCardAdded) {
      setTimeout(() => {
        const lastTextarea =
          textAreaRefs.current[textAreaRefs.current.length - 1];
        if (lastTextarea) lastTextarea.focus();
        setNewCardAdded(false); // Reset after focusing
      }, 0);
    }
  }, [cards, newCardAdded]);

  const SingleWorkspaceData = useCallback(async (workspaceId, token) => {
    try {
      const response = await axios.get(
        `https://api.bot.thesquirrel.tech/workspace/get/${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Workspace Data:", response.data.data);
      setSingleWorkspace(response.data.data);
      if (response.data.data.connectedAccounts?.length > 0) {
        setAccountId(response.data.data.connectedAccounts[0].userId);
      } else {
        console.log("No connected accounts found");
      }
    } catch (error) {
      toast.error("Failed to get Single Workspace");
      console.error("Error fetching workspace:", error);
      setSingleWorkspace(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (workspaceId && token) {
      SingleWorkspaceData(workspaceId, token);
    }
  }, [workspaceId, token, SingleWorkspaceData]);

  const handleTextareaChange = (id, val) => {
    setCards((prev) => {
      const updatedCards = prev.map((card) =>
        card.id === id ? { ...card, text: val } : card
      );
      const hasText = updatedCards.some((card) => card.text.trim() !== "");
      setActiveButtons(hasText);

      return updatedCards;
    });
  };

  const onPublish = async (scheduledDateTime = null) => {
    if (!accountId) {
      console.error("No accountId set for publishing");
      toast.error("Please connect an account to publish.");
      return;
    }

    // Ensure singleWorkspace and timezone exist
    const workspaceTimezone = singleWorkspace?.timezone || "UTC";

    // Convert scheduledDateTime to workspace's timezone
    let formattedDateTime = "";
    if (scheduledDateTime) {
      formattedDateTime = DateTime.fromJSDate(scheduledDateTime)
        .setZone(workspaceTimezone)
        .toFormat("yyyy-MM-dd HH:mm:ss"); // Format in local timezone

      console.log("Formate Time zone ", formattedDateTime);
    }

    const isThread = cards.length > 1 && postType === "thread";

    const formData = {
      mode: "create",
      posts: [
        isThread
          ? {
              mode: "create",
              type: "twitter",
              posttype: "thread",
              publishnow: scheduledDateTime ? false : true,
              tobePublishedAt: formattedDateTime,
              accountId: accountId,
              posts: cards.map((card) => ({
                mode: "create",
                content: card.text,
                type: "twitter",
                posttype: "post",
                publishnow: scheduledDateTime ? false : true,
                tobePublishedAt: formattedDateTime,
                media: [],
              })),
            }
          : {
              mode: "create",
              type: "twitter",
              posttype: "post",
              content: cards[0]?.text || "",
              publishnow: scheduledDateTime ? false : true,
              tobePublishedAt: formattedDateTime,
              accountId: accountId,
              media: [],
            },
      ],
    };

    try {
      const token = localStorage.getItem("token");

      console.log("Fetching presigned URL...");
      const presignedResponse = await axios.post(
        `https://api.bot.thesquirrel.tech/workspace/posts/create/presigned-url/${workspaceId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Presigned Response:", presignedResponse.data);

      const finalData = {
        posts: [...presignedResponse.data.data],
      };
      console.log("Final Data being sent:", JSON.stringify(finalData, null, 2));

      const finalResponse = await axios.post(
        `https://api.bot.thesquirrel.tech/workspace/posts/create/${workspaceId}`,
        finalData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Final Response:", finalResponse.data);
      toast(
        scheduledDateTime
          ? "Post scheduled successfully!"
          : "Post published successfully!"
      );
      setCards([{ id: 0, text: "" }]);
    } catch (error) {
      console.error(
        "Error posting data:",
        JSON.stringify(
          {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          },
          null,
          2
        )
      );
      toast.error(
        `Failed to schedule/publish post: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const createDraftPosts = async () => {
    if (!cards.length) {
      console.error("No cards available");
      return;
    }

    const isThread = cards.length > 1 && postType === "thread";

    const formData = {
      mode: "create",
      posts: [
        isThread
          ? {
              mode: "create",
              type: "twitter",
              posttype: "thread",
              publishnow: true,
              tobePublishedAt: "",
              accountId: accountId,
              posts: cards.map((card) => ({
                mode: "create",
                content: card.text,
                type: "twitter",
                posttype: "post",
                publishnow: true,
                tobePublishedAt: "",
                media: [],
              })),
            }
          : {
              mode: "create",
              type: "post",
              posttype: "post",
              content: cards[0].text || "",
              publishnow: true,
              tobePublishedAt: "",
              accountId: accountId,
              media: [],
            },
      ],
    };

    try {
      const token = localStorage.getItem("token");

      // Step 1: Get presigned URL response
      const presignedResponse = await axios.post(
        `https://api.bot.thesquirrel.tech/workspace/posts/create/presigned-url/${workspaceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let postData = presignedResponse.data?.data?.[0];

      if (!postData) {
        console.error("Invalid response structure:", presignedResponse.data);
        return;
      }

      // Step 2: Modify data for thread structure
      if (isThread) {
        postData = {
          type: "thread",
          threadPosts: postData.posts.map((post) => {
            const { mode, posttype, ...cleanedPost } = post;
            return cleanedPost; // Removing "mode" and "posttype"
          }),
        };
      } else {
        // For a normal post, remove "mode" and "posttype"
        delete postData.mode;
        delete postData.posttype;
      }

      // Step 3: Send final request to draft API
      const finalResponse = await axios.post(
        `https://api.bot.thesquirrel.tech/workspace/draft/create/${workspaceId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Final Response:", finalResponse.data);
      toast("Draft Post Has been created");
      SingleWorkspaceDraftData(
        workspaceId,
        token,
        setDraftLoading,
        setDraftPosts
      );
      setCards([{ id: 0, text: "" }]);
    } catch (error) {
      toast.error("Failed to make draft post");

      console.error("Error making draft post:", error);
    }
  };

  const EditDraftPosts = async () => {
    if (!cards.length) {
      console.error("No cards available");
      return;
    }

    const formData =
      postType === "thread"
        ? {
            type: "thread",
            threadId: threadIdForEdit,
            threadPosts: cards?.map((card, index) => ({
              _id: card.id,
              content: card.text || "",
              media: [],
              threadPosition: index + 1,
              previousPost: index > 0 ? cards[index - 1]._id : null,
              nextPost: index < cards.length - 1 ? cards[index + 1]._id : null,
            })),
          }
        : {
            type: "post",
            content: cards[0].text || "",
            _id: cards[0]?.id,
            media: [],
          };

    try {
      const token = localStorage.getItem("token");

      const finalResponse = await axios.put(
        `https://api.bot.thesquirrel.tech/workspace/draft/edit/${workspaceId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Final Response:", finalResponse.data);
      toast("Draft Post Has been Edited");

      setCards([{ id: 0, text: "" }]);

      SingleWorkspaceDraftData(
        workspaceId,
        token,
        setDraftLoading,
        setDraftPosts
      );
    } catch (error) {
      toast.error("Failed to edit draft post");

      console.error("Error making draft post:", error);
    }
  };

  const SingleWorkspaceDraftData = useCallback(
    async (workspaceId, token, setLoading, setDraftPosts) => {
      try {
        setDraftLoading(true);
        const response = await axios.get(
          `https://api.bot.thesquirrel.tech/workspace/draft/get/${workspaceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDraftPosts(response.data.data);
        console.log("draft ", response.data.data);
      } catch (error) {
        toast.error("Failed to get single workspace data");
        console.log("Error ", error);
        setDraftPosts(null);
      } finally {
        setDraftLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!loading && singleWorkspace === null) {
      notFound();
    }
  }, [loading, singleWorkspace]);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <>
      <ButtonsHeader
        isEditingDraft={isEditingDraft}
        onPublish={onPublish}
        activeButtons={activeButtons}
        createDraftPosts={createDraftPosts}
        EditDraftPosts={EditDraftPosts}
        singleWorkspace={singleWorkspace}
        cards={cards}
        setCards={setCards}
        textAreaRefs={textAreaRefs}
        setNewCardAdded={setNewCardAdded}
        SingleWorkspaceDraftData={SingleWorkspaceDraftData}
      />

      <Form>
        <form className="w-full flex-1 flex flex-col p-4 py-10  no-scrollbar overflow-y-auto items-center ">
          {cards.map((card, index) => (
            <CreatePostCard
              key={index}
              value={card.text}
              onChange={(val) => handleTextareaChange(card.id, val)}
              setCards={setCards}
              textareaRef={(el) => (textAreaRefs.current[index] = el)}
              setNewCardAdded={setNewCardAdded}
              cards={cards}
              setPostType={setPostType}
              cardId={card.id}
            />
          ))}
        </form>
      </Form>

      <DraftPosts
        workspaceId={workspaceId}
        token={token}
        setCards={setCards}
        cards={cards}
        postType={postType}
        setPostType={setPostType}
        isEditingDraft={isEditingDraft}
        setIsEditingDraft={setIsEditingDraft}
        threadIdForEdit={threadIdForEdit}
        setThreadIdForEdit={setThreadIdForEdit}
        SingleWorkspaceDraftData={SingleWorkspaceDraftData}
        draftPosts={draftPosts}
        setDraftPosts={setDraftPosts}
        draftLoading={draftLoading}
        setDraftLoading={setDraftLoading}
      />
    </>
  );
};

export default WorkspacePage;
