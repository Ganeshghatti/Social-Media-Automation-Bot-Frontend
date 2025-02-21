'use client';
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import ThreadImageSelector from "./post/components/thread-image-selector"; // Import ThreadImageSelector component

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";

import useAuthToken from "@hooks/useAuthToken";
import { workSpaceThreadSchema } from "@/schema/index";

const WorkSpaceThread = ({ accountId, workSpaceId }) => {
  const token = useAuthToken();
  const form = useForm({
    resolver: zodResolver(workSpaceThreadSchema),
    defaultValues: {
      type: "twitter",
      posttype: "thread",
      publishnow: false,
      tobePublishedAt: "",
      posts: [{ type: "post", content: "", media: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "posts",
  });

  // Ensure media is always an array
  const getMedia = (index) => {
    const media = form.watch(`posts.${index}.media`);
    return Array.isArray(media) ? media : [];
  };

  const handleImageSelect = (index, selectedImages) => {
    form.setValue(`posts.${index}.media`, selectedImages);
  };

  const handleRemoveImage = (index, imgIndex) => {
    const currentFiles = getMedia(index);
    const updatedFiles = currentFiles.filter((_, i) => i !== imgIndex);
    form.setValue(`posts.${index}.media`, updatedFiles);
  };

  const handleSubmit = async () => {
    try {
      const posts = form.getValues("posts");
      const [rootPost, ...remainingPosts] = posts; // Separate root post from remaining posts

      const formData = {
        posts: [
          {
            type: "twitter",
            posttype: "thread",
            mode: "create",
            content: rootPost?.content || "", // Get content from first post
            publishnow: form.getValues("publishnow"),
            tobePublishedAt: form.getValues("tobePublishedAt"),
            media: rootPost?.media?.map(media => ({
              originalname: media.originalname,
              size: media.size,
              mimetype: media.mimetype
            })) || [], // Get media from first post
            posts: remainingPosts?.map(post => ({  // Only map remaining posts
              mode: "create",
              posttype: "thread",
              content: post.content,
              media: post.media.map(media => ({
                originalname: media.originalname,
                size: media.size,
                mimetype: media.mimetype
              })),
              accountId: accountId
            })),
            accountId: accountId
          }
        ]
      };

      console.log("Sending Data:", formData);
      
      // First API call to get presigned URLs
      const presignedResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/posts/create/presigned-url/${workSpaceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Presigned Response:", presignedResponse);

      // Filter posts that have media
      const postsWithMedia = [
        { ...rootPost, isRoot: true },
        ...remainingPosts
      ].filter(post => post.media && post.media.length > 0);

      if (postsWithMedia.length > 0) {
        console.log("Step 2: Uploading media files for posts", postsWithMedia);

        for (let postIndex = 0; postIndex < postsWithMedia.length; postIndex++) {
          const post = postsWithMedia[postIndex];
          const responsePost = post.isRoot 
            ? presignedResponse.data.data[0] 
            : presignedResponse.data.data[0].posts[postIndex - 1]; // Subtract 1 to account for root post

          console.log("Processing post:", responsePost);

          if (post.media && responsePost.media) {
            for (let mediaIndex = 0; mediaIndex < post.media.length; mediaIndex++) {
              const mediaItem = post.media[mediaIndex];
              const presignedMediaItem = responsePost.media[mediaIndex];

              console.log("Processing media item:", presignedMediaItem);

              if (mediaItem && presignedMediaItem && mediaItem.blobUrl) {
                console.log(`Uploading file ${mediaIndex + 1} for post ${postIndex + 1}`);

                try {
                  const imageBlob = await fetch(mediaItem.blobUrl).then(r => r.blob());
                  const uploadResult = await axios.put(
                    presignedMediaItem.presignedUrl,
                    imageBlob,
                    {
                      headers: {
                        'Content-Type': mediaItem.mimetype,
                      },
                    }
                  );

                  console.log(`File upload status:`, uploadResult.status);
                } catch (uploadError) {
                  console.error(`Error uploading file:`, uploadError);
                  throw uploadError;
                }
              }
            }
          }
        }
      }

      console.log("Step 3: Creating final post");

      const finalResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/posts/create/${workSpaceId}`,
        {
          posts: presignedResponse.data.data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Final Response:", finalResponse);
      console.log("Thread created successfully:", finalResponse.data);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div className="px-16 py-10">
      <Form {...form}>
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg">
                <FormField
                  control={form.control}
                  name={`posts.${index}.content`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post Content {index + 1}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Write your post content ${index + 1}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Thread Image Selector */}
                <div className="mt-4">
                  <ThreadImageSelector
                    token={token}
                    postIndex={index}
                    selectedImages={getMedia(index)}
                    onImageSelect={handleImageSelect}
                  />
                </div>

                {/* Post Actions */}
                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Remove Post
                  </Button>
                  {index === fields.length - 1 && (
                    <Button
                      type="button"
                      onClick={() => append({ type: "post", content: "", media: [] })}
                    >
                      Add Another Post
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <FormField
            control={form.control}
            name="publishnow"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-4">
                <FormLabel>Publish Now</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!form.watch("publishnow") && (
            <FormField
              control={form.control}
              name="tobePublishedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish At</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      className="focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end mt-6">
            <Button 
              type="button"
              className="px-8"
              onClick={handleSubmit}
            >
              Create Thread
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default WorkSpaceThread;
