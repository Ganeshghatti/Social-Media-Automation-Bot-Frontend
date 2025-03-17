"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@components/ui/textarea";

import { ChevronDown, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import useAuthToken from "@hooks/useAuthToken";
import { CreatePostHeader } from "@components/CreatePost/CreatePostHeader";
import { TIMEZONES } from "@constants/create-workspace/index";
import Image from "next/image";
const Page = () => {
  const [loading, setLoading] = useState(false);
  const [keywordInput, setKeywordInput] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const router = useRouter();
  const token = useAuthToken() || "";
  const fileInputRef = useRef(null);
  const handleDivClick = () => {
    fileInputRef.current?.click(); // Trigger the hidden input
  };

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    keywords: z.array(z.string()),
    icon: z.any().optional().nullable(),
    timezone: z.string(),
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
    console.log("File input changed"); // Debugging
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File selected:", file.name);

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

  const onSubmit = async (data) => {
    try {
      if (!token) {
        console.log("No token available");
        return;
      }
      setLoading(true);

      const payload = {
        name: data.name,
        timezone: data.timezone || "IST", // Default to IST if not selected
        settings: {
          description: data.description,
          keywords: data.keywords || [],
        },
      };

      // Add icon if available
      if (data.icon) {
        payload.icon = {
          originalname: data.icon.originalname,
          size: data.icon.size,
          mimetype: data.icon.mimetype,
        };
      }

      console.log("Sending request with payload:", payload);

      const response = await axios.post(
        `https://api.bot.thesquirrel.site/workspace/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response received:", response.data);

      // Upload the image if we got a presigned URL back
      if (
        response.data.success &&
        data.icon &&
        response.data.data.presignedUrl
      ) {
        console.log("Uploading file to presigned URL");
        await axios.put(response.data.data.presignedUrl, data.icon.file, {
          headers: {
            "Content-Type": data.icon.mimetype,
          },
        });
        console.log("File upload complete");
      }
      
      console.log("Redirecting to workspaces page");
      router.push("/workspaces");
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      alert(
        `Error creating workspace: ${
          error.response?.data?.message || error.message
        }`
      );
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-start gap-4 justify-start bg-navBg min-h-screen w-full flex-col ">
      <CreatePostHeader />

      <div className="flex gap-6 flex-col w-[96%] mx-auto py-3 ">
        <h1 className="text-4xl font-semibold  text-white md:text-left text-center">Create Workspace</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full rounded-xl bg-headerBg
             border-[#ffffff30] px-5 py-6 flex flex-col gap-6"
          >
            <div className="w-full flex gap-3 items-center justify-between flex-wrap md:flex-row flex-col">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full bg-navBg text-white py-4 border rounded-[20px] border-[#ffffff30] px-2">
                    <FormControl>
                      <Input
                        className="bg-transparent border-transparent focus:border-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[24px] placeholder:text-[24px]"
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
                  <div className="flex-1 w-full flex gap-3 bg-navBg text-white py-4 border rounded-[20px] justify-center items-center border-[#ffffff30] px-2">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTimezone(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-transparent border-transparent focus:border-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 text-xl text-[#ffffff60]">
                        <SelectValue
                          placeholder="Timezone = (08:00)"
                          className="bg-transparent"
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-navBg text-white">
                        {TIMEZONES.map((time_zone, i) => (
                          <SelectItem
                            key={i}
                            className="cursor-pointer bg-navBg hover:opacity-90 hover:bg-navBg focus:bg-navBg focus:opacity-70 focus:text-white"
                            value={time_zone.name} // Just use the timezone name like "IST"
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
                  <div className="flex-1 w-full relative">
                    <input
                      type="file"
                      id="fileInput"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e)}
                    />
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="flex gap-3 cursor-pointer
                       bg-navBg text-white py-5 border rounded-[20px] justify-center 
                       items-center border-[#ffffff30] px-2"
                    >
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
                          className="object-contain h-6 w-6"
                        />
                      )}

                      <span className="text-2xl text-white opacity-50">
                        {iconPreview ? "Change Image" : "Upload Image"}
                      </span>
                    </div>
                  </div>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem
                  className="flex-1 bg-navBg
                 text-white py-4 border rounded-[20px] border-[#ffffff30] px-2"
                >
                  <FormControl className="text-2xl">
                    <Textarea
                      className="bg-navBg text-white border-transparent focus:border-transparent focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-[24px] placeholder:text-[24px] rounded-xl py-4"
                      rows={10}
                      placeholder="Enter Description"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem
                  className="flex-1 bg-navBg text-white py-4 border 
                rounded-[20px] border-[#ffffff30] px-2"
                >
                  <FormControl>
                    <Input
                      placeholder="Add keyword"
                      value={keywordInput}
                      className="bg-navBg text-white
                       border-transparent focus:border-transparent focus:outline-none 
                       focus-visible:bg-transparent focus-within:bg-transparent focus:ring-0
                        focus-visible:ring-0 focus-visible:ring-offset-0 text-[24px] 
                        placeholder:text-[24px] rounded-xl py-2 focus:bg-transparent"
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
                  className="flex items-center text-white gap-4
                   bg-primary px-3 py-2 rounded-full"
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
              className="bg-primary 
              hover:bg-primary/90 text-white py-6 text-xl rounded-[20px]"
            >
              {loading ? "Creating..." : "Create Workspace"}
            </Button>
       
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
