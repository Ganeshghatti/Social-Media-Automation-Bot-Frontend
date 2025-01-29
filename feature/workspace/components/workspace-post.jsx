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

  const handleFileChange = (e, onChange) => {
    const files = Array.from(e.target.files);
    const currentFiles = form.getValues("media") || [];
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
                          className="absolute top-0 right-0 bg-red-500 text-white  rounded-full p-1 focus:outline-none"
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
