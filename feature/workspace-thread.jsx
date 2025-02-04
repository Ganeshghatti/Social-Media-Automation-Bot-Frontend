import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";

import axios from "axios";

import { Switch } from "@components/ui/switch"; // Assuming you have a Switch component
import { workSpaceThreadSchema } from "@/schema/index";
import useAuthToken from "@hooks/useAuthToken";

const WorkSpaceThread = ({ accountId, workSpaceId }) => {
  const token = useAuthToken();

  const form = useForm({
    resolver: zodResolver(workSpaceThreadSchema),
    defaultValues: {
      type: "twitter",
      posttype: "thread",
      publishnow: false,
      tobePublishedAt: "",
      posts: [
        {
          type: "post",
          content: "",
          media: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "posts",
  });

  const onSubmit = async (data) => {
    const formData = {
      posts: [
        {
          accountId: accountId,
          type: "twitter",
          posttype: "thread",
          publishnow: data.publishnow,
          tobePublishedAt: data.tobePublishedAt,
          posts: data.posts.map((post) => ({
            ...post,
            media: post.media.map(({ blobUrl, ...rest }) => rest),
          })),
        },
      ],
    };

    try {
      console.log("Step 1: Sending initial data:", formData);

      const presignedResponse = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/posts/create/presigned-url/${workSpaceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Presigned Response ",presignedResponse)

      const postsWithMedia = data.posts.filter(
        (post) => post.media && post.media.length > 0
      );

      if (postsWithMedia.length > 0) {
        console.log("Step 2: Uploading media files for posts ",postsWithMedia);

        for (
          let postIndex = 0;
          postIndex < postsWithMedia.length;
          postIndex++
        ) {
          const post = postsWithMedia[postIndex];
          const responsePost = presignedResponse.data.data[0].posts[postIndex];

          console.log("Response post ",responsePost)

          if (post.media && responsePost.media) {
            for (
              let mediaIndex = 0;
              mediaIndex < post.media.length;
              mediaIndex++
            ) {
              const mediaItem = post.media[mediaIndex];
              const presignedMediaItem = responsePost.media[mediaIndex];
              console.log("Media ",presignedMediaItem)

              if (mediaItem && presignedMediaItem) {
                console.log(
                  `Uploading file ${mediaIndex + 1} for post ${postIndex + 1}`
                );

                try {
                  const imageBlob = await fetch(mediaItem.blobUrl).then((r) =>
                    r.blob()
                  );
                  const uploadResult = await axios.put(
                    presignedMediaItem.presignedUrl,
                    imageBlob,
                    {
                      headers: {
                        "Content-Type": mediaItem.mimetype,
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

      console.log("Final Response ",finalResponse)

      console.log("Post created successfully:", finalResponse.data);
    } catch (error) {
      console.error("Error posting data", error);
    }
  };

  const handleFileChange = (e, onChange, index) => {
    const files = Array.from(e.target.files);
    const currentFiles = form.getValues(`posts.${index}.media`) || [];
    if (currentFiles.length + files.length > 4) {
      alert("You can only upload a maximum of 4 images.");
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

  const handleRemoveImage = (index, imgIndex, onChange) => {
    const currentFiles = form.getValues(`posts.${index}.media`) || [];
    const updatedFiles = currentFiles.filter((_, i) => i !== imgIndex);
    onChange(updatedFiles);
  };

  return (
    <div className="px-16 py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              <FormField
                control={form.control}
                name={`posts.${index}.content`}
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
                name={`posts.${index}.media`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleFileChange(e, field.onChange, index)
                        }
                        className="focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                    <div className="mt-4 flex">
                      {field.value &&
                        field.value.map((file, imgIndex) => (
                          <div key={imgIndex} className="mb-2 relative">
                            <img
                              src={file.blobUrl}
                              alt={file.originalname}
                              className="w-64 h-64 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveImage(
                                  index,
                                  imgIndex,
                                  field.onChange
                                )
                              }
                              className="absolute top-0
                               right-0 bg-red-500 text-white rounded-full p-1 
                               focus:outline-none"
                            >
                              X
                            </button>
                          </div>
                        ))}
                    </div>
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => remove(index)}>
                Delete Post
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => append({ type: "post", content: "", media: [] })}
          >
            Add Post
          </Button>
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
          <Button type="submit" className="focus:outline-none">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WorkSpaceThread;
