import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { workSpacePostSchema } from "@/schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import axios from "axios";
import useAuthToken from "@/hooks/useAuthToken";

const WorkSpacePost = ({ accountId, workSpaceId }) => {
  const [postId, setPostId] = useState();

  const form = useForm({
    resolver: zodResolver(workSpacePostSchema),
    defaultValues: {
      posttype: "post",
      publishnow: false,
      content: "",
      tobePublishedAt: "",
      media: [],
    },
  });

  const onSubmit = async (data) => {
    try {
      const token = useAuthToken();


      const formData = {
        posts: [
          {
            accountId: accountId,
            type: "twitter",
            ...data,
            media: data.media.map(({ blobUrl, ...rest }) => rest),
          },
        ],
      };

      console.log("Step 1: Sending initial request with data:", formData);

      // Step 1: Get presigned URLs
      const presignedResponse = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/posts/create/presigned-url/${workSpaceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Step 1 Response:", presignedResponse.data);

      const mediaFromResponse = presignedResponse.data.data[0]?.media;

      if (mediaFromResponse && mediaFromResponse.length > 0) {
        console.log(
          "Step 2: Uploading media files. Count:",
          mediaFromResponse.length
        );

        for (let i = 0; i < mediaFromResponse.length; i++) {
          const media = mediaFromResponse[i];
          const imageFile = data.media[i];

          console.log(`Uploading file ${i + 1}/${mediaFromResponse.length}`);

          try {
            const imageBlob = await fetch(imageFile.blobUrl).then((r) =>
              r.blob()
            );

            const uploadResult = await axios.put(
              media.presignedUrl,
              imageBlob,
              {
                headers: {
                  "Content-Type": imageFile.mimetype,
                },
              }
            );

            console.log(`File ${i + 1} upload status:`, uploadResult.status);
          } catch (uploadError) {
            console.error(`Error uploading file ${i + 1}:`, uploadError);
            throw uploadError;
          }
        }

        console.log("Step 3: Creating final post");

        // Step 3: Create final post with all media
        const finalResponse = await axios.post(
          `https://api.bot.thesquirrel.site/workspace/posts/create/${workSpaceId}`,
          {
            posts: presignedResponse.data.data,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Post created successfully:", finalResponse.data);
      } else {
        // Handle post without media
        const finalResponse = await axios.post(
          `https://api.bot.thesquirrel.site/workspace/posts/create/${workSpaceId}`,
          {
            posts: presignedResponse.data.data,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Post created successfully (no media):",
          finalResponse.data
        );
      }
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        request: error.config,
      });
      throw error;
    }
  };

  const handleFileChange = (e, onChange) => {
    const files = Array.from(e.target.files);
    const currentFiles = form.getValues("media") || [];

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 30 * 1024 * 1024; // 30MB

    if (totalSize > maxTotalSize) {
      alert("Total size of all files cannot exceed 30MB");
      return;
    }

    if (currentFiles.length + files.length > 4) {
      alert("You can only upload a maximum of 4 files.");
      return;
    }

    // Stricter file type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      alert("Please only upload supported image types (JPG, PNG, GIF)");
      return;
    }

    // Individual file size check
    const maxSize = 8 * 1024 * 1024; // 8MB per file
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert("Each file must be under 8MB");
      return;
    }

    const fileData = files.map((file) => ({
      originalname: file.name,
      size: file.size,
      mimetype: file.type,
      blobUrl: URL.createObjectURL(file),
    }));

    onChange([...currentFiles, ...fileData]);
  };

  const handleRemoveImage = (index, onChange) => {
    const currentFiles = form.getValues("media") || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  return (
    <div className="px-16 py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value}
                    onChange={field.onChange}
                    className="focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="posttype"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post Type</FormLabel>
                <FormControl>
                  <Select
                    className="w-[80vh]"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-64 focus:outline-none">
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publishnow"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-4">
                <FormLabel className="pt-2">Publish Now</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("publishnow") === false && (
            <FormField
              control={form.control}
              name="tobePublishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish At</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      value={field.value}
                      onChange={field.onChange}
                      className="focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, field.onChange)}
                    className="focus:outline-none"
                  />
                </FormControl>
                <FormMessage />
                <div className="mt-4 flex">
                  {field.value &&
                    field.value.map((file, index) => (
                      <div key={index} className="mb-2 relative">
                        <img
                          src={file.blobUrl}
                          alt={file.originalname}
                          className="w-64 h-64 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveImage(index, field.onChange)
                          }
                          className="absolute top-0 right-0 px-4 py-4 bg-red-500 text-white  rounded-full p-1 focus:outline-none"
                        >
                          X
                        </button>
                      </div>
                    ))}
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className="focus:outline-none">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WorkSpacePost;
