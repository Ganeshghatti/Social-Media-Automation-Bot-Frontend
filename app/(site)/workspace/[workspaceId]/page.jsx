"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@components/ui/button";
import {
  ChevronsUpDown,
  EllipsisVertical,
  MoonIcon,
  Plus,
  Settings,
  SettingsIcon,
} from "lucide-react";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/ui/accordion";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@components/ui/context-menu";

import {
  connectTwitter,
  disconnectTwitter,
  connectLinkedin,
  disconnectLinkedIn,
} from "@functions/social/index";

import { CreatePostCard } from "@components/CreatePost/CreatePostCard";
import { Sidebar } from "@components/CreatePost/Sidebar";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import { ButtonsHeader } from "@components/CreatePost/ButtonsHeader";

import WorkspaceSettings from "@feature/workspace/components/workspace-setting";
import WorkspaceCreate from "@feature/workspace/components/workspace-create";
import WorkspaceEdit from "@feature/workspace/components/workspace-edit";
import WorkSpacePost from "@feature/workspace/components/workspace-post";
import useAuthToken from "@hooks/useAuthToken";
import WorkSpaceThread from "@feature/workspace-thread";
import { useUserStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import Link from "next/link";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import Image from "next/image";
import { Switch } from "@components/ui/switch";
import { Card, CardContent, CardFooter, CardTitle } from "@components/ui/card";
import { Textarea } from "@components/ui/textarea";
import { Form } from "@components/ui/form";

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

  if (user === null)
    return (
      <div className="flex flex-col">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );

  return (
    <div className="flex-1 flex flex-col h-screen">
      <CreatePostHeader />
      <ButtonsHeader onPublish={onPublish} activeButtons={activeButtons} />
      <Form>
        <form className="w-full flex-1 p-4 py-10 overflow-y-auto justify-center items-center">
          {cards.map((card, index) => (
            <CreatePostCard
              key={card.id}
              threadNumber={index + 1}
              value={card.text}
              onChange={(val) => handleTextareaChange(card.id, val)}
              setCards={setCards}
              cards={cards}
              textareaRef={(el) => (textAreaRefs.current[index] = el)}
              setNewCardAdded={setNewCardAdded}
            />
          ))}
        </form>
      </Form>
    </div>
  );
};

export default WorkspacePage;
