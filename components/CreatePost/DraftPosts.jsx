"use client";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@components/ui/card";
import { Edit, Trash } from "lucide-react";

export const DraftPosts = ({
  workspaceId,
  token,
  setCards,
  cards,
  postType,
  setPostType,
  isEditingDraft,
  setIsEditingDraft,
}) => {
  const [draftPosts, setDraftPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const SingleWorkspaceData = useCallback(async (workspaceId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/draft/get/${workspaceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDraftPosts(response.data.data);
      console.log("draft ", response.data.data);
    } catch (error) {
      console.log("Error ", error);
      setDraftPosts(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const DeleteDraftPost = async (draftType, draftPostId) => {
    try {
      setLoading(true);

      console.log("Deelete Draft Type ", draftType);

      const response = await axios.delete(
        `https://api.bot.thesquirrel.site/workspace/draft/delete/${workspaceId}`, // Correct API endpoint
        {
          data: {
            type: draftType,
            ...(draftType === "thread"
              ? { threadId: draftPostId }
              : { postId: draftPostId }),
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Draft deleted:", response.data.data);
      SingleWorkspaceData(workspaceId, token);
    } catch (error) {
      console.error("Error deleting draft:", error);
      SingleWorkspaceData(workspaceId, token);
    } finally {
      setLoading(false);
    }
  };

  const EditDraftPosts = (draftType, draftPostId, draft) => {
    setIsEditingDraft(true);
    if (draft?.type === "thread") {
      setCards(
        draft.threadPosts.map((post, index) => ({
          id: index,
          text: post.content,
        }))
      );
    } else {
      setCards([{ id: 0, text: draft.content }]); // For non-thread drafts
    }
  };

  useEffect(() => {
    SingleWorkspaceData(workspaceId, token);
  }, [workspaceId, token]);

  if (!loading) {
    <main className="flex w-full flex-1 justify-around px-4 py-3">
      <h1 className="text-2xl font-semibold">Loading...</h1>
    </main>;
  }

  return (
    <section className="flex justify-start w-[96%]  mb-4  mx-auto items-center px-4  py-3">
      <Accordion
        type="single"
        collapsible
        className="w-full flex-1 flex gap-4 justify-around items-center"
      >
        <AccordionItem value="draft-posts " className="w-full text-white">
          {" "}
          <AccordionTrigger>Draft Posts</AccordionTrigger>
          <AccordionContent
            className=" grid md:grid-cols-4 items-center grid-cols-2 justify-around w-full rounded-xl bg-headerBg
             border-[#ffffff30] px-5 py-6   gap-6"
          >
            {draftPosts?.length > 0 &&
              draftPosts.map((draft, i) => (
                <Card
                  key={i}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className={` bg-navBg text-white py-4  border rounded-[20px] border-[#ffffff30] 
                  px-4`}
                >
                  <CardContent className="px-0">
                    <CardDescription className="text-white text-lg">
                      {draft.type === "thread"
                        ? draft?.threadPosts?.[0]?.content
                        : draft.content}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="p-0 space-x-3 ">
                    <div
                      onClick={() => {
                        if (draft?.type) {
                          DeleteDraftPost(
                            draft.type,
                            draft?.type === "thread"
                              ? draft.threadId
                              : draft._id
                          );
                        }
                      }}
                      className={`px-3 py-2 rounded-sm bg-headerBg cursor-pointer  ${
                        isHovering ? "scale-100" : "scale-0"
                      } duration-300`}
                    >
                      <Trash className="text-red-500" />
                    </div>

                    <div
                      onClick={() =>
                        EditDraftPosts(
                          draft.type,
                          draft?.type === "thread" ? draft.threadId : draft._id,
                          draft
                        )
                      }
                      className={`px-3 py-2 rounded-sm bg-headerBg cursor-pointer ${
                        isHovering ? "scale-100" : "scale-0"
                      } duration-300`}
                    >
                      <Edit className="text-green-500" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
};
