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
import { DateTime } from "luxon";
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
  const [cards, setCards] = useState([{ id: 0, text: "", media: [] }]);
  const textAreaRefs = useRef([]);
  const [newCardAdded, setNewCardAdded] = useState(false);
  const [activeButtons, setActiveButtons] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [threadIdForEdit, setThreadIdForEdit] = useState("");
  const [draftPosts, setDraftPosts] = useState([]);
  const [draftLoading, setDraftLoading] = useState(false);

  useEffect(() => {
    if (token) fetchUser(token);
  }, [token, fetchUser]);

  useEffect(() => {
    if (user && !user.onboarding) router.replace("/onboarding");
  }, [user, router]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        setCards((prev) => [...prev, { id: prev.length, text: "", media: [] }]);
        setNewCardAdded(true);
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
        const lastTextarea = textAreaRefs.current[textAreaRefs.current.length - 1];
        if (lastTextarea) lastTextarea.focus();
        setNewCardAdded(false);
      }, 0);
    }
  }, [cards, newCardAdded]);

  const SingleWorkspaceData = useCallback(async (workspaceId, token) => {
    try {
      const response = await axios.get(
        `https://api.bot.thesquirrel.tech/workspace/get/${workspaceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    if (workspaceId && token) SingleWorkspaceData(workspaceId, token);
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

  const handleImageSelect = (id, selectedImages) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, media: selectedImages } : card
      )
    );
  };

  const onPublish = async (scheduledDateTime = null) => {
    if (!accountId) {
      toast.error("Please connect an account to publish.");
      return;
    }

    const workspaceTimezone = singleWorkspace?.timezone || "UTC";
    let formattedDateTime = scheduledDateTime
      ? DateTime.fromJSDate(scheduledDateTime)
          .setZone(workspaceTimezone)
          .toFormat("yyyy-MM-dd HH:mm:ss")
      : "";

    const isThread = cards.length > 1 && postType === "thread";

    // Step 1: Prepare form data (matching previous structure)
    const formData = {
      posts: [
        {
          accountId: accountId,
          type: "twitter",
          mode: "create",
          posttype: isThread ? "thread" : "post",
          publishnow: !scheduledDateTime,
          tobePublishedAt: formattedDateTime,
          ...(isThread
            ? {
                posts: cards.map((card) => ({
                  mode: "create",
                  content: card.text,
                  media: card.media.map((img) => ({
                    originalname: img.name,
                    size: img.size || 0,
                    mimetype: img.mimetype || "image/jpeg",
                  })),
                })),
              }
            : {
                content: cards[0]?.text || "",
                media: cards[0]?.media.map((img) => ({
                  originalname: img.name,
                  size: img.size || 0,
                  mimetype: img.mimetype || "image/jpeg",
                })) || [],
              }),
        },
      ],
    };

    console.log("Step 1: Sending initial data:", JSON.stringify(formData, null, 2));

    try {
      // Step 2: Get presigned URLs
      const presignedResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/posts/create/presigned-url/${workspaceId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Presigned Response:", presignedResponse.data);

      const threadData = presignedResponse.data.data[0];
      if (threadData && threadData.posts?.length > 0) {
        console.log("Step 2: Uploading media files for posts", threadData.posts);

        // Step 3: Upload media files (for threads)
        for (const responsePost of threadData.posts) {
          console.log("Response Post:", responsePost);
          if (responsePost.media && responsePost.media.length > 0) {
            console.log(`Processing media for post ID: ${responsePost._id}`);
            const originalPost = cards.find((p) => p.text === responsePost.content);
            console.log("Original Post:", originalPost);

            if (originalPost && originalPost.media) {
              console.log("Original post media:", originalPost.media);

              for (let i = 0; i < responsePost.media.length; i++) {
                const presignedMedia = responsePost.media[i];
                const originalMedia = originalPost.media[i];
                console.log("Presigned media:", presignedMedia);
                console.log("Original media:", originalMedia);

                const mediaUrl = originalMedia.type === "blob" ? originalMedia.imageUrl : originalMedia.imageUrl;

                if (presignedMedia.presignedUrl && mediaUrl) {
                  try {
                    console.log(`Uploading media ${i + 1} for post ${responsePost._id}`);
                    const imageBlob = await fetch(mediaUrl).then((r) => r.blob());
                    const uploadResult = await axios.put(
                      presignedMedia.presignedUrl,
                      imageBlob,
                      { headers: { "Content-Type": presignedMedia.mimetype } }
                    );
                    console.log(`Media ${i + 1} upload status:`, uploadResult);
                  } catch (error) {
                    console.error(`Error uploading media ${i + 1}:`, error);
                    throw new Error(`Failed to upload media: ${error.message}`);
                  }
                }
              }
            }
          }
        }
      } else if (threadData && threadData.media?.length > 0) {
        // Step 3: Upload media files (for single post)
        console.log("Step 2: Uploading media files for single post", threadData.media);
        for (let i = 0; i < threadData.media.length; i++) {
          const presignedMedia = threadData.media[i];
          const originalMedia = cards[0].media[i];
          console.log("Presigned media:", presignedMedia);
          console.log("Original media:", originalMedia);

          const mediaUrl = originalMedia.type === "blob" ? originalMedia.imageUrl : originalMedia.imageUrl;

          if (presignedMedia.presignedUrl && mediaUrl) {
            try {
              console.log(`Uploading media ${i + 1} for post ${threadData._id}`);
              const imageBlob = await fetch(mediaUrl).then((r) => r.blob());
              const uploadResult = await axios.put(
                presignedMedia.presignedUrl,
                imageBlob,
                { headers: { "Content-Type": presignedMedia.mimetype } }
              );
              console.log(`Media ${i + 1} upload status:`, uploadResult);
            } catch (error) {
              console.error(`Error uploading media ${i + 1}:`, error);
              throw new Error(`Failed to upload media: ${error.message}`);
            }
          }
        }
      }

      // Step 4: Create final post
      console.log("Step 3: Creating final post");
      const finalResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/posts/create/${workspaceId}`,
        { posts: presignedResponse.data.data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Final Response:", finalResponse.data);
      toast(scheduledDateTime ? "Post scheduled successfully!" : "Post published successfully!");
      setCards([{ id: 0, text: "", media: [] }]);
    } catch (error) {
      console.error("Error creating post/thread:", error);
      toast.error(`Failed to schedule/publish post: ${error.response?.data?.message || error.message}`);
    }
  };

  const createDraftPosts = async () => {
    // if (!cards.length) return;

    // const isThread = cards.length > 1 && postType === "thread";
    // const formData = {
    //   posts: [
    //     {
    //       accountId: accountId,
    //       type: "twitter",
    //       mode: "create",
    //       posttype: isThread ? "thread" : "post",
    //       publishnow: true,
    //       tobePublishedAt: "",
    //       ...(isThread
    //         ? {
    //             posts: cards.map((card) => ({
    //               mode: "create",
    //               content: card.text,
    //               media: card.media.map((img) => ({
    //                 originalname: img.name,
    //                 size: img.size || 0,
    //                 mimetype: img.mimetype || "image/jpeg",
    //               })),
    //             })),
    //           }
    //         : {
    //             content: cards[0].text || "",
    //             media: cards[0]?.media.map((img) => ({
    //               originalname: img.name,
    //               size: img.size || 0,
    //               mimetype: img.mimetype || "image/jpeg",
    //             })) || [],
    //           }),
    //     },
    //   ],
    // };

    // console.log("draft form data", formData);

    // try {
    //   const presignedResponse = await axios.post(
    //     `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/posts/create/presigned-url/${workspaceId}`,
    //     formData,
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );

    //   let postData = presignedResponse.data?.data?.[0];
    //   if (!postData) throw new Error("Invalid response structure");

    //   if (isThread) {
    //     postData = {
    //       type: "thread",
    //       threadPosts: postData.posts.map((post) => {
    //         const { mode, posttype, ...cleanedPost } = post;
    //         return cleanedPost;
    //       }),
    //     };
    //   } 

    //   const finalResponse = await axios.post(
    //     `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/draft/create/${workspaceId}`,
    //     postData,
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );

    //   console.log("finalResponse of draft post", finalResponse);

    //   toast("Draft Post Has been created");
    if (!accountId) {
      toast.error("Please connect an account to publish.");
      return;
    }

    // const workspaceTimezone = singleWorkspace?.timezone || "UTC";
    // let formattedDateTime = scheduledDateTime
    //   ? DateTime.fromJSDate(scheduledDateTime)
    //       .setZone(workspaceTimezone)
    //       .toFormat("yyyy-MM-dd HH:mm:ss")
    //   : "";

    const isThread = cards.length > 1 && postType === "thread";

    // Step 1: Prepare form data (matching previous structure)
    const formData = {
      posts: [
        {
          accountId: accountId,
          type: "twitter",
          mode: "create",
          posttype: isThread ? "thread" : "post",
          publishnow: true,
          tobePublishedAt: "",
          ...(isThread
            ? {
                posts: cards.map((card) => ({
                  mode: "create",
                  content: card.text,
                  media: card.media.map((img) => ({
                    originalname: img.name,
                    size: img.size || 0,
                    mimetype: img.mimetype || "image/jpeg",
                  })),
                })),
              }
            : {
                content: cards[0]?.text || "",
                media: cards[0]?.media.map((img) => ({
                  originalname: img.name,
                  size: img.size || 0,
                  mimetype: img.mimetype || "image/jpeg",
                })) || [],
              }),
        },
      ],
    };

    console.log("Step 1: Sending initial data:", JSON.stringify(formData, null, 2));

    try {
      // Step 2: Get presigned URLs
      const presignedResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/posts/create/presigned-url/${workspaceId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Presigned Response:", presignedResponse.data);

      const threadData = presignedResponse.data.data[0];
      if (threadData && threadData.posts?.length > 0) {
        console.log("Step 2: Uploading media files for posts", threadData.posts);

        // Step 3: Upload media files (for threads)
        for (const responsePost of threadData.posts) {
          console.log("Response Post:", responsePost);
          if (responsePost.media && responsePost.media.length > 0) {
            console.log(`Processing media for post ID: ${responsePost._id}`);
            const originalPost = cards.find((p) => p.text === responsePost.content);
            console.log("Original Post:", originalPost);

            if (originalPost && originalPost.media) {
              console.log("Original post media:", originalPost.media);

              for (let i = 0; i < responsePost.media.length; i++) {
                const presignedMedia = responsePost.media[i];
                const originalMedia = originalPost.media[i];
                console.log("Presigned media:", presignedMedia);
                console.log("Original media:", originalMedia);

                const mediaUrl = originalMedia.type === "blob" ? originalMedia.imageUrl : originalMedia.imageUrl;

                if (presignedMedia.presignedUrl && mediaUrl) {
                  try {
                    console.log(`Uploading media ${i + 1} for post ${responsePost._id}`);
                    const imageBlob = await fetch(mediaUrl).then((r) => r.blob());
                    const uploadResult = await axios.put(
                      presignedMedia.presignedUrl,
                      imageBlob,
                      { headers: { "Content-Type": presignedMedia.mimetype } }
                    );
                    console.log(`Media ${i + 1} upload status:`, uploadResult);
                  } catch (error) {
                    console.error(`Error uploading media ${i + 1}:`, error);
                    throw new Error(`Failed to upload media: ${error.message}`);
                  }
                }
              }
            }
          }
        }
      } else if (threadData && threadData.media?.length > 0) {
        // Step 3: Upload media files (for single post)
        console.log("Step 2: Uploading media files for single post", threadData.media);
        for (let i = 0; i < threadData.media.length; i++) {
          const presignedMedia = threadData.media[i];
          const originalMedia = cards[0].media[i];
          console.log("Presigned media:", presignedMedia);
          console.log("Original media:", originalMedia);

          const mediaUrl = originalMedia.type === "blob" ? originalMedia.imageUrl : originalMedia.imageUrl;

          if (presignedMedia.presignedUrl && mediaUrl) {
            try {
              console.log(`Uploading media ${i + 1} for post ${threadData._id}`);
              const imageBlob = await fetch(mediaUrl).then((r) => r.blob());
              const uploadResult = await axios.put(
                presignedMedia.presignedUrl,
                imageBlob,
                { headers: { "Content-Type": presignedMedia.mimetype } }
              );
              console.log(`Media ${i + 1} upload status:`, uploadResult);
            } catch (error) {
              console.error(`Error uploading media ${i + 1}:`, error);
              throw new Error(`Failed to upload media: ${error.message}`);
            }
          }
        }
      }

      // Step 4: Create final post
      console.log("Step 3: Creating final post");
      const finalResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/draft/create/${workspaceId}`,
        { posts: presignedResponse.data.data },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Final Response:", finalResponse.data);
      toast("post draft has been created");
      SingleWorkspaceDraftData(workspaceId, token, setDraftLoading, setDraftPosts);
      setCards([{ id: 0, text: "", media: [] }]);
    } catch (error) {
      toast.error("Failed to make draft post");

      console.error("Error making draft post:", error);
    }
  };

  const EditDraftPosts = async () => {
    if (!cards.length) return;

    const formData =
      postType === "thread"
        ? {
            type: "thread",
            threadId: threadIdForEdit,
            threadPosts: cards.map((card, index) => ({
              _id: card.id,
              content: card.text || "",
              media: card.media || [],
              threadPosition: index + 1,
              previousPost: index > 0 ? cards[index - 1]._id : null,
              nextPost: index < cards.length - 1 ? cards[index + 1]._id : null,
            })),
          }
        : {
            type: "post",
            content: cards[0].text || "",
            _id: cards[0]?.id,
            media: cards[0]?.media || [],
          };

    try {
      const finalResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/draft/edit/${workspaceId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast("Draft Post Has been Edited");
      setCards([{ id: 0, text: "", media: [] }]);
      SingleWorkspaceDraftData(workspaceId, token, setDraftLoading, setDraftPosts);
    } catch (error) {
      toast.error("Failed to edit draft post");

      console.error("Error editing draft post:", error);
    }
  };

  const SingleWorkspaceDraftData = useCallback(
    async (workspaceId, token, setLoading, setDraftPosts) => {
      try {
        setDraftLoading(true);
        const response = await axios.get(
          `https://api.bot.thesquirrel.tech/workspace/draft/get/${workspaceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDraftPosts(response.data.data);
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
        <form
          className="w-full  flex-1 p-4 py-10 mb-8 no-scrollbar overflow-y-auto
         justify-center items-center"
        >
          {cards.map((card, index) => (
            <CreatePostCard
              key={index}
              value={card.text}
              onChange={(val) => handleTextareaChange(card.id, val)}
              setCards={setCards}
              textareaRef={(el) => (textAreaRefs.current[index] = el)}
              setNewCardAdded={setNewCardAdded}
              selectedImages={card.media}
              onImageSelect={(images) => handleImageSelect(card.id, images)}
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