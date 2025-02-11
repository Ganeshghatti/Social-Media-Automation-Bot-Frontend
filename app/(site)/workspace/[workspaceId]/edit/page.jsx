"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import useAuthToken from "@hooks/useAuthToken";

const EditWorkspace = () => {
  const [loading, setLoading] = useState(false);
  const [singleWorkspace, setSingleWorkspace] = useState(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const router = useRouter();
  const token = useAuthToken() || "";
  const params = useParams();
  const { workspaceId } = params;

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    about: z.string().min(1, "About is required"),
    description: z.string().min(1, "Description is required"),
    keywords: z.array(z.string()),
    icon: z.any().optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      about: "",
      description: "",
      keywords: [],
      icon: null,
    },
  });

  const keywords = form.watch("keywords");

  const handleFileChange = (e, onChange) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
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

    onChange(fileData);
    setIconPreview(URL.createObjectURL(file));
  };

  const SingleWorkspaceData = async (workspaceId, token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.bot.thesquirrel.site/workspace/get/${workspaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSingleWorkspace(response.data.data);
      if (response.data.data) {
        setIconPreview(response.data.data.icon);
        form.reset({
          name: response.data.data.name || "",
          about: response.data.data.about || "",
          description: response.data.data.settings.description || "",
          keywords: response.data.data.settings.keywords || [],
        });
      }
    } catch (error) {
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
      setLoading(true);

      const payload = {
        name: data.name,
        about: data.about,
        settings: {
          description: data.description,
          keywords: data.keywords,
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
        `https://api.bot.thesquirrel.site/workspace/edit/${workspaceId}`,
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
        await axios.put(response.data.data.presignedUrl, data.icon.file, {
          headers: { "Content-Type": data.icon.mimetype },
        });
      }

      router.push("/workspaces");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col gap-6 w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Update Workspace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field: { onChange } }) => (
                    <FormItem>
                      <FormLabel>Workspace Icon</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, onChange)}
                          />
                          {iconPreview && (
                            <div className="relative w-24 h-24">
                              <img
                                src={iconPreview}
                                alt="Icon preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setIconPreview(singleWorkspace?.icon || null);
                                  onChange(null);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Rest of the form fields remain the same */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter workspace name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Input placeholder="About workspace" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywords"
                  render={() => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add keyword"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addKeyword(keywordInput);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={() => addKeyword(keywordInput)}
                          >
                            Add
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => removeKeyword(keyword)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Workspace"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditWorkspace;
