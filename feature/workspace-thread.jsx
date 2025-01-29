import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

import axios from "axios";

import { Switch } from "@/components/ui/switch"; // Assuming you have a Switch component
import { workSpaceThreadSchema } from "@/schema";

const WorkSpaceThread = ({ accountId, workSpaceId }) => {
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
          ...data,
          posts: data.posts.map((post) => ({
            ...post,
            media: post.media.map(({ blobUrl, ...rest }) => rest),
          })),
        },
      ],
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/posts/create/presigned-url/${workSpaceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response", response.data);

      const finalData = {
        posts: [...response.data.data],
      };

      const finalResponse = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/posts/create/${workSpaceId}`,
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Final Response", finalResponse.data);
    } catch (error) {
      console.error("Error posting data", error);
    }

    console.log("DATA", formData);
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
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 focus:outline-none"
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
