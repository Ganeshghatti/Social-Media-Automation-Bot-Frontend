import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import Image from "next/image";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const WorkspaceCreate = ({ isOpen, setIsOpen }) => {
  const [file, setFile] = useState(null);

  const token = localStorage.getItem("token");

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    about: z.string().min(1, "About is required"),
    icon: z.instanceof(File, "An icon file is required"),
    settings: z.object({
      description: z.string().min(1, "Description is required"),
      keywords: z.array(z.string()).min(1, "At least one keyword is required"),
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      about: "",
      icon: undefined,
      settings: { description: "", keywords: [] },
    },
  });

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      form.setValue("icon", uploadedFile);
    }
  };

  const onSubmit = async (values) => {
    try {
      console.log(values);

      const response = await axios.post(
        "https://api.bot.thesquirrel.site/workspace/create",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Workspace created:", response.data);
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Error creating workspace:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize text-lg">
              Create a New Workspace
            </DialogTitle>
            <DialogDescription>
              Enter your Information Below to Create a WorkSpace
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
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
                      <Textarea
                        placeholder="Write about your workspace"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input type="file" onChange={handleFileChange} />
                </FormControl>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected File: {file.name} ({file.size} bytes)
                  </p>
                )}
                <FormMessage>{form.formState.errors.icon?.message}</FormMessage>
              </FormItem>
              <FormField
                name="settings.description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="settings.keywords"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="Type a keyword and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const value = e.target.value.trim();
                              if (value && !field.value?.includes(value)) {
                                field.onChange([...(field.value || []), value]);
                                e.target.value = "";
                              }
                            }
                          }}
                        />
                        <div className="flex flex-wrap gap-2">
                          {field.value?.map((keyword, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full"
                            >
                              <span>{keyword}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter((_, i) => i !== index)
                                  );
                                }}
                                className="text-sm hover:text-destructive"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Create Workspace</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceCreate;
