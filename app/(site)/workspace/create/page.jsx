"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
import { toast } from "sonner";
import { CustomLoader } from "@/components/global/CustomLoader";
import { handleApiError } from "@/lib/ErrorResponse";
import { GLOBAL_KEYWORDS } from "@constants/keywords/index";
const Page = () => {
  const [loading, setLoading] = useState(true); // Set to true initially
  const [keywordInput, setKeywordInput] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState("");
  const router = useRouter();
  const token = useAuthToken() || "";
  const fileInputRef = useRef(null);
  const MAX_KEYWORDS = 200;
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for dropdown to handle outside clicks
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      timezone: "IST",
    },
  });

  const keywords = form.watch("keywords");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

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
      console.log("Form data:", data);
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

      if (data.icon) {
        payload.icon = {
          originalname: data.icon.originalname,
          size: data.icon.size,
          mimetype: data.icon.mimetype,
        };
      }

      console.log("Sending request with payload:", payload);

      const response = await axios.post(
        `https://api.bot.thesquirrel.tech/workspace/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response received:", response.data);
      if (response.data.success) {
        if (data.icon && response.data.data.presignedUrl) {
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
      } else {
        throw new Error(
          response.data.error?.message || "Failed to create workspace"
        );
      }
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        "Failed to create workspace. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordInputChange = (value) => {
    setKeywordInput(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }
    const filteredSuggestions = GLOBAL_KEYWORDS.filter((item) =>
      item.keyword.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
    setIsDropdownOpen(true);
  };

  const addKeyword = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !keywords.includes(trimmedValue)) {
      if (keywords.length >= MAX_KEYWORDS) {
        toast.error("Keywords can't exceed 200 words");
        return;
      }
      form.setValue("keywords", [...keywords, trimmedValue], {
        shouldValidate: true,
      });
    }
    setKeywordInput("");
    setIsDropdownOpen(false);
  };

  const removeKeyword = (keywordToRemove) => {
    form.setValue(
      "keywords",
      keywords.filter((keyword) => keyword !== keywordToRemove),
      { shouldValidate: true }
    );
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <div className="flex items-start gap-4 justify-start bg-navBg min-h-screen w-full flex-col px-4 md:px-8">
      <CreatePostHeader />

      <div
        className="flex gap-6 flex-col w-full mx-auto py-3 
      max-w-[90%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[80%] xl:max-w-[60%] 
      2xl:max-w-[60%] min-h-screen"
      >
        <h1
          className="text-3xl md:text-4xl font-semibold text-white 
        text-center md:text-left"
        >
          Create Workspace
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full rounded-xl bg-headerBg border-[#ffffff30] px-4 md:px-6 py-6 flex flex-col gap-6"
          >
            <div className="w-full flex flex-col lg:flex-row flex-wrap gap-4 flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full min-h-[48px] bg-navBg text-white border rounded-[20px] border-[#ffffff30] px-3">
                    <FormControl>
                      <Input
                        className="bg-transparent border-transparent focus:border-transparent focus:outline-none focus:ring-0 text-base md:text-base placeholder:text-base h-full py-2"
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
                  <div className="flex-1 w-full flex items-center justify-center bg-navBg text-white border rounded-[20px] border-[#ffffff30] px-3 min-h-[48px]">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTimezone(value);
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-transparent border-transparent focus:outline-none focus:ring-0 flex-1 text-base md:text-xl text-[#ffffff60] min-h-[48px]">
                        <SelectValue placeholder="Timezone = (08:00)" />
                      </SelectTrigger>
                      <SelectContent className="bg-navBg text-white">
                        {TIMEZONES.map((time_zone, i) => (
                          <SelectItem
                            key={i}
                            className="cursor-pointer bg-navBg hover:bg-opacity-90 focus:bg-navBg focus:text-white text-base"
                            value={time_zone.name}
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
                  <div className="flex-1 justify-center">
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center gap-3 cursor-pointer
                       bg-navBg text-white border rounded-[20px] border-[#ffffff30]
                        px-4 w-full md:w-auto min-h-[48px] py-2"
                    >
                      <Input
                        type="file"
                        id="fileInput"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e)}
                      />
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
                          className="h-6 w-6 object-contain"
                        />
                      )}
                      <span className="text-base md:text-base text-white opacity-50">
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
                <div className="flex-1 flex-col space-y-1 ">
                  <FormLabel className="text-white text-base">
                    Describe your workspace
                  </FormLabel>

                  <FormItem
                    className="flex-1 bg-navBg text-white py-2
                 border rounded-[20px] border-[#ffffff30] px-3"
                  >
                    <FormControl>
                      <Textarea
                        className="bg-navBg text-white border-transparent
                       focus:border-transparent focus:outline-none focus:ring-0 text-base
                        md:text-base placeholder:text-base rounded-xl py-2"
                        rows={6}
                        placeholder="Describe your workspace. You can connect social accounts and publish posts directly from here."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem className="relative flex-1 bg-navBg text-white border rounded-[20px] border-[#ffffff30] px-3 min-h-[48px]">
                  <FormControl>
                    <Input
                      placeholder="Add keyword"
                      value={keywordInput}
                      className="bg-navBg text-white border-transparent focus:border-transparent focus:outline-none text-base md:text-base placeholder:text-base rounded-[20px] py-2 min-h-[48px]"
                      onChange={(e) => handleKeywordInputChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addKeyword(keywordInput);
                        }
                      }}
                    />
                  </FormControl>

                  {/* Dropdown for suggestions */}
                  {isDropdownOpen && suggestions.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 top-full left-0 mt-2 w-full bg-navBg border border-[#ffffff30] rounded-lg max-h-60 overflow-y-auto shadow-lg"
                    >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-white hover:bg-primary/90 cursor-pointer"
                          onClick={() => addKeyword(suggestion.keyword)}
                        >
                          <div className="font-semibold">
                            {suggestion.keyword}
                          </div>
                          <div className="text-sm text-gray-400">
                            {suggestion.supportingKeywords.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-2 px-3">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center text-white gap-2 bg-primary px-3 py-2 rounded-full"
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

            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 mx-auto px-6 w-full md:w-auto text-white py-4 text-lg md:text-xl rounded-full"
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
