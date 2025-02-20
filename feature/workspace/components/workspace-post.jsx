import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";

import { workSpacePostSchema } from "@/schema/index";

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
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ImageFetch from "@feature/post/components/image-fetch";

import axios from "axios";
import useAuthToken from "@/hooks/useAuthToken";

const WorkSpacePost = ({ accountId, workSpaceId }) => {
  const token = useAuthToken();
  const [selectedImages, setSelectedImages] = useState([]);
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
      // Format selected images to match API requirements
      const formattedSelectedImages = selectedImages.map((image) => {
        // Extract filename from URL or use a default name
        const originalname = image.imageUrl.split('/').pop() || 'image.jpg';
        return {
          originalname,
          size: image.size || 0,
          mimetype: image.type || 'image/jpeg'
        };
      });

      // Format form media to match API requirements
      const formattedFormImages = (data.media || [])
        .filter(image => image && image.blobUrl)
        .map((image) => ({
          originalname: image.name || image.blobUrl.split('/').pop() || 'image.jpg',
          size: image.size || 0,
          mimetype: image.type || 'image/jpeg'
        }));

      // Combine and remove duplicates
      const uniqueUrls = new Set();
      const mergedImages = [...formattedSelectedImages, ...formattedFormImages].filter(image => {
        if (!uniqueUrls.has(image.originalname)) {
          uniqueUrls.add(image.originalname);
          return true;
        }
        return false;
      });

      // Check if total images exceed 4
      if (mergedImages.length > 4) {
        throw new Error("Cannot upload more than 4 images");
      }

      // Store original media data for upload
      const mediaForUpload = selectedImages.concat(
        (data.media || []).filter(image => image && image.blobUrl)
      );

      // Create form data with proper media format
      const formData = {
        posts: [
          {
            accountId: accountId,
            type: "twitter",
            mode: "create",
            posttype: data.posttype,
            content: data.content,
            publishnow: data.publishnow,
            tobePublishedAt: data.tobePublishedAt,
            media: mergedImages // Using properly formatted media objects
          },
        ],
      };

      // Step 1: Get presigned URLs
      const presignedResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/workspace/posts/create/presigned-url/${workSpaceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const mediaFromResponse = presignedResponse.data.data[0]?.media || [];

      if (mediaFromResponse.length > 0) {
        // Ensure we have matching media items
        if (mediaFromResponse.length !== mediaForUpload.length) {
          throw new Error("Mismatch between uploaded media and server response");
        }

        // Upload each media file
        for (let i = 0; i < mediaFromResponse.length; i++) {
          const mediaResponse = mediaFromResponse[i];
          const originalMedia = mediaForUpload[i];
          
          try {
            // Get the blob URL from either selected images or form media
            const blobUrl = originalMedia.imageUrl || originalMedia.blobUrl;
            const imageBlob = await fetch(blobUrl).then(r => r.blob());
            
            await axios.put(mediaResponse.presignedUrl, imageBlob, {
              headers: {
                "Content-Type": mediaResponse.mimetype,
              },
            });
          } catch (uploadError) {
            console.error(`Error uploading file ${i + 1}:`, uploadError);
            throw uploadError;
          }
        }

        // Create final post with uploaded media
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

        console.log("Post created successfully:", finalResponse.data);
      } else {
        // Handle post without media
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

        console.log("Post created successfully (no media):", finalResponse.data);
      }

      // Reset form and selected images after successful submission
      form.reset();
      setSelectedImages([]);
      
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error appropriately (show toast/notification)
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

  const handleRemoveImages = (imageToRemove) => {
    setSelectedImages(
      selectedImages.filter((img) => img.imageUrl !== imageToRemove.imageUrl)
    );
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

          {selectedImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Selected Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => handleRemoveImages(image)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" className="focus:outline-none">
            Submit
          </Button>
        </form>
      </Form>
      <ImageFetch
            token={token}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
    </div>
  );
};

export default WorkSpacePost;
