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
      const data = form.getValues();

      const formData = {
        posts: [
          {
            type: "twitter",
            posttype: "thread",
            mode: "create",
            publishnow: data.publishnow,
            tobePublishedAt: data.tobePublishedAt,
            accountId: accountId,
            posts: data.posts.map(post => ({
              mode: "create",
              content: post.content,
              media: post.media || [],
            }))
          }
        ]
      };

      console.log("Step 1: Sending initial data:", formData);

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

      // Get the thread data from the response
      const threadData = presignedResponse.data.data[0];
      
      if (threadData && threadData.posts && threadData.posts.length > 0) {
        console.log("Step 2: Uploading media files for posts", threadData.posts);

        // Iterate through each post in the thread
        for (const responsePost of threadData.posts) {

          console.log("Response Post:", responsePost);
          if (responsePost.media && responsePost.media.length > 0) {
            console.log(`Processing media for post ID: ${responsePost._id}`);

            // Find matching original post by comparing content
            const originalPost = data.posts.find(p => p.content === responsePost.content);

            console.log("Original Post:", originalPost);

            if (originalPost && originalPost.media) {

              console.log("Original post media:", originalPost.media);

              // Process each media item
              for (let i = 0; i < responsePost.media.length; i++) {
                const presignedMedia = responsePost.media[i];
                const originalMedia = originalPost.media[i];

                console.log("Presigned media:", presignedMedia);
                console.log("Original media:", originalMedia);

                // Check for either blobUrl (for uploaded files) or imageUrl (for selected images)
                const mediaUrl = originalMedia.type === 'blob' ? originalMedia.blobUrl : originalMedia.imageUrl;

                if (presignedMedia.presignedUrl && mediaUrl) {
                  try {
                    console.log(`Uploading media ${i + 1} for post ${responsePost._id}`);
                    
                    let imageBlob;
                    if (originalMedia.type === 'blob') {
                      // For uploaded files, use the blob URL
                      imageBlob = await fetch(originalMedia.blobUrl).then(r => r.blob());
                    } else {
                      // For selected images (from search), use the image URL
                      imageBlob = await fetch(originalMedia.imageUrl).then(r => r.blob());
                    }
                    
                    // Upload to presigned URL
                    const uploadResult = await axios.put(
                      presignedMedia.presignedUrl,
                      imageBlob,
                      {
                        headers: {
                          'Content-Type': presignedMedia.mimetype,
                        },
                      }
                    );

                    console.log(`Media ${i + 1} upload status:`, uploadResult);
                  } catch (error) {
                    console.error(`Error uploading media ${i + 1} for post ${responsePost._id}:`, error);
                    throw new Error(`Failed to upload media: ${error.message}`);
                  }
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
