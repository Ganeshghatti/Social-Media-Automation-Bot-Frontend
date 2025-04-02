"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import useAuthToken from "@hooks/useAuthToken";
import { Textarea } from "@components/ui/textarea";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { TIMEZONES } from "@constants/create-workspace/index";
import Image from "next/image";
import { Sidebar_Card } from "@components/single-workspace/Sidebar_Card";
import { disconnectLinkedIn, disconnectTwitter } from "@functions/social";
import { useUserStore } from "@/store/userStore";
import { CustomLoader } from "@components/global/CustomLoader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { toast } from "sonner";
import { handleApiError } from "@lib/ErrorResponse";
const EditWorkspace = () => {
  const [loading, setLoading] = useState(false);
  const [singleWorkspace, setSingleWorkspace] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const fileInputRef = useRef(null);
  const token = useAuthToken() || "";
  const params = useParams();
  const { workspaceId } = params;

  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!user?.onboarding) {
      router.replace("/onboarding");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    keywords: z.array(z.string()),
    icon: z.any().optional().nullable(),
    timezone: z.string().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      keywords: [],
      icon: null,
      timezone: "",
    },
  });

  const keywords = form.watch("keywords");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    const fileData = {
      originalname: file.name,
      size: file.size,
      mimetype: file.type,
      file: file,
    };

    form.setValue("icon", fileData);
    setIconPreview(URL.createObjectURL(file));
    console.log("Preview set:", URL.createObjectURL(file));
  };

  const SingleWorkspaceData = async (workspaceId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.tech/workspace/get/${workspaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response data ", response.data.data);
      setSingleWorkspace(response.data.data);
      if (response.data.data) {
        setIconPreview(response.data.data.icon);
        form.reset({
          name: response.data.data.name || "",
          description: response.data.data.settings.description || "",
          keywords: response.data.data.settings.keywords || [],
          timezone: response.data.data.timezone || "ISD",
        });
      }
    } catch (error) {
      toast.error("Failed to get single workspace data");

      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    SingleWorkspaceData(workspaceId, token);
  }, [token, workspaceId]);

  const onSubmit = async (data) => {
    try {
      if (!token) return;

      const payload = {
        name: data.name,
        timezone: data.timezone || "IST", // Default to IST if not selected
        settings: {
          description: data.description,
          keywords: data.keywords || [],
        },
      };

      if (data.icon) {
        payload.icon = {
          originalname: data.icon.originalname,
          size: data.icon.size,
          mimetype: data.icon.mimetype,
        };
      }

      const response = await axios.put(
        `https://api.bot.thesquirrel.tech/workspace/edit/${workspaceId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (
        response.data.success &&
        data.icon &&
        response.data.data.presignedUrl
      ) {
        const finalResponse = await axios.put(
          response.data.data.presignedUrl,
          data.icon.file,
          {
            headers: { "Content-Type": data.icon.mimetype },
          }
        );

        if (finalResponse.data.success) {
          console.log("Edited Workspace Data ", response.data.data);
          toast("Workspace has been edited");
        } else {
          throw new Error(
            response.data.error?.message || "Failed to edit workspace"
          );
        }
      }
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to edit workspace. Please try again."
      );
    }
  };

  const deleteWorkspace = async (data) => {
    try {
      if (!token) return;

      const response = await axios.delete(
        `https://api.bot.thesquirrel.tech/workspace/delete/${workspaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast(`Workspace deleted`);
        router.push("/workspaces");
      } else {
        throw new Error(
          response.data.error?.message || "Failed to delete workspace"
        );
      }
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to delete workspace. Please try again."
      );
    }
  };

  const addKeyword = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !keywords.includes(trimmedValue)) {
      form.setValue("keywords", [...keywords, trimmedValue], {
        shouldValidate: true,
      });
    }
    setKeywordInput("");
  };

  const removeKeyword = (keywordToRemove) => {
    form.setValue(
      "keywords",
      keywords.filter((keyword) => keyword !== keywordToRemove),
      { shouldValidate: true }
    );
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <>
      <div
        className="flex gap-6 flex-col w-full
       mx-auto py-3 max-w-[90%]
        sm:max-w-[90%] md:max-w-[80%] pb-6  lg:max-w-[80%] xl:max-w-[60%] 2xl:max-w-[60%] min-h-screen"
      >
        <h1 className="text-2xl md:text-4xl font-semibold text-white text-center md:text-left">
          Edit Workspace
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full rounded-xl bg-headerBg border-[#ffffff30]
             px-4 md:px-6 py-6 flex flex-col gap-6"
          >
            <div className="w-full flex flex-col lg:flex-row flex-wrap gap-4 flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full min-h-[48px] bg-navBg text-white border rounded-[20px] border-[#ffffff30] px-3">
                    <FormControl>
                      <Input
                        className="bg-transparent border-transparent focus:border-transparent focus:outline-none focus:ring-0 text-base md:text-base placeholder:text-base h-full py-2"
                        placeholder="Workspace name"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <div className="flex-1 w-full flex items-center justify-center bg-navBg text-white border rounded-[20px] border-[#ffffff30] px-3 min-h-[48px]">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTimezone(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-transparent border-transparent focus:outline-none focus:ring-0 flex-1 text-base md:text-xl text-[#ffffff60] min-h-[48px]">
                        <SelectValue placeholder="Timezone = (08:00)" />
                      </SelectTrigger>
                      <SelectContent className="bg-navBg text-white">
                        {TIMEZONES.map((time_zone, i) => (
                          <SelectItem
                            key={i}
                            className="cursor-pointer bg-navBg hover:bg-opacity-90 focus:bg-navBg focus:text-white text-base"
                            value={time_zone.name}
                          >
                            {time_zone.name} ({time_zone.offset})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <div className="flex-1 justify-center">
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center gap-3 cursor-pointer bg-navBg text-white border rounded-[20px] border-[#ffffff30] px-4 w-full md:w-auto min-h-[48px] py-2"
                    >
                      <Input
                        type="file"
                        id="fileInput"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e)}
                      />
                      {iconPreview ? (
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src={iconPreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Image
                          src="/Upload-Workspace.png"
                          alt="Upload Image"
                          height={24}
                          width={24}
                          className="h-6 w-6 object-contain"
                        />
                      )}
                      <span className="text-base md:text-base text-white opacity-50">
                        {iconPreview ? "Change Image" : "Upload Image"}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Icon Upload */}

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem
                  className="flex-1 bg-navBg text-white py-2
                        border rounded-[20px] border-[#ffffff30] px-3"
                >
                  <FormControl>
                    <Textarea
                      className="bg-navBg text-white border-transparent
                              focus:border-transparent focus:outline-none focus:ring-0 text-base
                               md:text-base placeholder:text-base rounded-xl py-2"
                      rows={6}
                      placeholder="Enter Description"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Keywords Input */}
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem className="flex-1 bg-navBg text-white border rounded-[20px] border-[#ffffff30] px-3 min-h-[48px]">
                  <FormControl>
                    <Input
                      placeholder="Add keyword"
                      value={keywordInput}
                      className="bg-navBg text-white border-transparent 
                 focus:border-transparent focus:outline-none text-base 
                 md:text-base placeholder:text-base rounded-[20px] py-2 min-h-[48px]"
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyword(keywordInput);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Keywords Display */}
            <div className="flex flex-wrap gap-2 px-3">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center text-white gap-2 bg-primary px-3 py-2 rounded-full"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="text-white hover:text-foreground"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 
                   mx-auto px-6 w-full md:w-auto text-white py-4 text-lg md:text-xl rounded-full"
            >
              {loading ? "Editing..." : "Edit Workspace"}
            </Button>
          </form>
        </Form>
        <div className="flex gap-6  flex-col w-[96%] mx-auto py-3 ">
          <h1 className="text-4xl font-semibold  text-white">
            Disconnect Accounts
          </h1>
          {singleWorkspace?.connectedAccounts?.length === 0 && (
            <h3 className="text-2xl font-medium text-gray-100">
              No Account To Disconnect
            </h3>
          )}
          {singleWorkspace?.connectedAccounts?.length > 0 && (
            <div className="flex w-full gap-6 items-center">
              <div className="max-w-max rounded-xl bg-headerBg border-[#ffffff30] px-5 py-6 flex flex-col gap-6">
                {singleWorkspace?.connectedAccounts?.map((account, i) => {
                  if (account?.type === "linkedin") {
                    return (
                      <Sidebar_Card
                        key={i}
                        onClickFunction={() => {
                          disconnectLinkedIn(
                            workspaceId,
                            account?.userId,
                            token
                          );
                          router.push(`/workspace/${workspaceId}`);
                        }}
                        imageUrl={"/linkedIn.png"}
                        text={"Disconnect LinkedIn"}
                      />
                    );
                  } else if (account?.type === "twitter") {
                    return (
                      <Sidebar_Card
                        onClickFunction={() => {
                          disconnectTwitter(
                            workspaceId,
                            account?.userId,
                            token
                          );
                          router.push(`/workspace/${workspaceId}`);
                        }}
                        key={i}
                        imageUrl={"/twitter.png"}
                        text={"Disconnect " + account?.username}
                      />
                    );
                  }
                })}
              </div>
            </div>
          )}
        </div>

        <div
          className="flex gap-6 my-6  mb-6  flex-col w-[96%]  
         mx-auto  "
        >
          <h1 className="text-4xl font-semibold  text-white">
            Delete Workspace
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 w-max rounded-full py-5">
                <span className="text-lg font-medium">Delete Workspace</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-navBg gap-3 text-white border-transparent">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription className="text-white/60">
                  This action cannot be undone. This will permanently delete
                  your workspace and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter
                className={"flex justify-center mt-2   items-center "}
              >
                <Button
                  onClick={() => {
                    deleteWorkspace();
                  }}
                  className="bg-red-600 mx-auto hover:bg-red-700  rounded-full py-5"
                >
                  <span className="text-base font-medium">Yes Delete</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default EditWorkspace;
