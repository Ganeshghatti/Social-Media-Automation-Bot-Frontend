"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

import { CreatePostCard } from "@components/CreatePost/CreatePostCard";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import { ButtonsHeader } from "@components/CreatePost/ButtonsHeader";
import { DraftPosts } from "@components/CreatePost/DraftPosts";
import { toast } from "sonner";

import useAuthToken from "@hooks/useAuthToken";
import { useUserStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";

import { Form } from "@components/ui/form";
import axios from "axios";

const WorkspacePage = () => {
  const { workspaceId } = useParams();
  const router = useRouter();
  const token = useAuthToken();
  const [accountId, setAccountId] = useState();
  const { user, fetchUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [singleWorkspace, setSingleWorkspace] = useState(null);
  const [postType, setPostType] = useState("post");
  const [cards, setCards] = useState([{ id: 0, text: "" }]);
  const textAreaRefs = useRef([]); // Refs for all textareas
  const [newCardAdded, setNewCardAdded] = useState(false); // Track new card addition
  const [activeButtons, setActiveButtons] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUser(token); // Pass token as parameter
    }
  }, [token, fetchUser]);

  useEffect(() => {
    if (user) {
      if (!user.onboarding) {
        router.replace("/onboarding");
      }
    }
  }, [user, router]);

  const focusLastTextarea = () => {
    setTimeout(() => {
      const lastTextarea =
        textAreaRefs.current[textAreaRefs.current.length - 1];
      if (lastTextarea) lastTextarea.focus();
    }, 0); // Ensure DOM is updated
  };

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
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/get/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSingleWorkspace(response.data.data);
      setAccountId(response.data?.data?.connectedAccounts[0]?.userId);
    } catch (error) {
      console.log("Error ", error);
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

  const onPublish = async () => {
    console.log("function is invoked ")
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
              })),
            }
          : {
              mode: "create",
              type: "twitter",
              posttype: "post",
              content: cards[0]?.text || "",
              publishnow: true,
              tobePublishedAt: "",
              accountId: accountId,
            },
      ],
    };

    try {
      const token = localStorage.getItem("token");

      // Step 1: Get presigned URL
      const presignedResponse = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/posts/create/presigned-url/${workspaceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 2: Final create post request
      const finalData = {
        mode: "create",
        posts: [...presignedResponse.data.data],
      };

      const finalResponse = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/posts/create/${workspaceId}`,
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Final Response:", finalResponse.data);
    } catch (error) {
      console.error("Error posting data:", error);
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
        `https://api.bot.thesquirrel.site/workspace/posts/create/presigned-url/${workspaceId}`,
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
        `https://api.bot.thesquirrel.site/workspace/draft/create/${workspaceId}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Final Response:", finalResponse.data);
      toast("Draft Post Has been created");
    } catch (error) {
      console.error("Error making draft post:", error);
    }
  };

  const EditDraftPosts = async (postId) => {
    if (!cards.length) {
      console.error("No cards available");
      return;
    }

    console.log("Cards ",cards)

    const isThread = cards.length > 1 && postType === "thread";

    const formData =
      postType === "thread"
        ? {
            type: "thread",
            threadId: "67c353fbeea397f07e82c32b",
            threadPosts: cards.map((card, index) => ({
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
            _id: "67c34e60eea397f07e82c152",
            media: [],
          };

    try {
      const token = localStorage.getItem("token");

      const finalResponse = await axios.put(
        `https://api.bot.thesquirrel.site/workspace/draft/edit/${workspaceId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Final Response:", finalResponse.data);
      toast("Draft Post Has been Edited");
    } catch (error) {
      console.error("Error making draft post:", error);
    }
  };

  if (user === null)
    return (
      <div className="flex flex-col">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );

  return (
    <main className="flex-1 flex flex-col h-screen overflow-y-auto">
      <CreatePostHeader />
      <ButtonsHeader
        isEditingDraft={isEditingDraft}
        onPublish={onPublish}
        createDraftPosts={createDraftPosts}
        activeButtons={activeButtons}
        EditDraftPosts={EditDraftPosts}
      />
      <button className="bg-blue-500 max-w-[150px] w-full text-white text-xl px-4 py-2 rounded" onClick={() => onPublish()}>
        Create Post
      </button>
      <Form>
        <form className="w-full flex-1 p-4 py-10 mb-8 overflow-y-auto justify-center items-center">
          {cards.map((card, index) => (
            <CreatePostCard
              key={index}
              threadNumber={index + 1}
              value={card.text}
              onChange={(val) => handleTextareaChange(card.id, val)}
              setCards={setCards}
              cards={cards}
              textareaRef={(el) => (textAreaRefs.current[index] = el)}
              setNewCardAdded={setNewCardAdded}
              isFirst={index === 0} // First card in the list
              isLast={index === cards.length - 1} // Last card in the list
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
      />
    </main>
  );
};

export default WorkspacePage;
