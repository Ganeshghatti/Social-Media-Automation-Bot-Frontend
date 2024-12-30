"use client";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import axios from "axios";

// Add file type validation
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type UploadType =
  | "automated"
  | "manual"
  | "only-automate-content-with-prompt"
  | "only-automate-image-with-prompt"
  | "automate-with-prompt"
  | "";

interface SelectOption {
  label: string;
  value: UploadType;
}

interface GeneratePostResponse {
  success: boolean;
  message?: string;
}

interface FormData {
  selectedType: UploadType;
  text: string;
  prompt: string;
  file: File | null;
  publishDate: Date | null;
  publishTime: string;
  filePreview: string | null;
}

const selectOptions: SelectOption[] = [
  {
    label: "Automated",
    value: "automated",
  },
  {
    label: "Manual",
    value: "manual",
  },
  {
    label: "Only automate content with prompt",
    value: "only-automate-content-with-prompt",
  },
  {
    label: "Only automate image with prompt",
    value: "only-automate-image-with-prompt",
  },
  {
    label: "Automate with prompt",
    value: "automate-with-prompt",
  },
];

const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.bot.thesquirrel.site";

export function GenerateModal({ fetchPosts }: { fetchPosts: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    selectedType: "",
    text: "",
    prompt: "",
    file: null,
    filePreview: null,
    publishDate: null,
    publishTime: "10:00", // default time
  });
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleInputChange = (
    field: keyof FormData,
    value: FormData[keyof FormData]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);

    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError("Please upload a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError("File size should be less than 5MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        file,
        filePreview: previewUrl,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        file: null,
        filePreview: null,
      }));
    }
  };

  React.useEffect(() => {
    return () => {
      if (formData.filePreview) {
        URL.revokeObjectURL(formData.filePreview);
      }
    };
  }, [formData.filePreview]);

  const generatePost = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const uploadData = new FormData();
      uploadData.append("action", formData.selectedType);

      if (formData.publishDate && formData.publishTime) {
        const adjustedDateTime = adjustDateTimeForTimezone(
          formData.publishDate,
          formData.publishTime
        );
        if (adjustedDateTime) {
          uploadData.append("tobePublishedAt", adjustedDateTime.toISOString());
        }
      }

      switch (formData.selectedType) {
        case "manual":
          if (!formData.text)
            throw new Error("Text is required for manual posts");
          uploadData.append("text", formData.text);
          if (formData.file) {
            uploadData.append("img", formData.file);
          }
          break;

        case "only-automate-content-with-prompt":
          if (!formData.prompt)
            throw new Error("Prompt is required for automated content");
          uploadData.append("prompt", formData.prompt);
          break;

        case "only-automate-image-with-prompt":
          if (!formData.text || !formData.prompt) {
            throw new Error(
              "Both text and prompt are required for automated image posts"
            );
          }
          uploadData.append("text", formData.text);
          uploadData.append("prompt", formData.prompt);
          break;

        case "automate-with-prompt":
          if (!formData.prompt)
            throw new Error("Prompt is required for automated posts");
          uploadData.append("prompt", formData.prompt);
          break;

        case "automated":
          break;

        default:
          throw new Error("Invalid upload type selected");
      }

      const response = await axios.post<GeneratePostResponse>(
        `${BACKEND_URI}/twitter/create-post`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        await fetchPosts();
        
        setFormData({
          selectedType: "",
          text: "",
          prompt: "",
          file: null,
          filePreview: null,
          publishDate: null,
          publishTime: "10:00",
        });
        console.log("post uploaded successfully", response.data);
      } else {
        throw new Error(response.data.message || "Failed to generate post");
      }
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const adjustDateTimeForTimezone = (date: Date, time: string): Date | null => {
    try {
      if (!date) return null;

      const [hours, minutes] = time.split(":").map(Number);
      let adjustedDate = new Date(date);

      adjustedDate.setHours(hours, minutes, 0, 0);

      const userTimezoneOffset = adjustedDate.getTimezoneOffset();
      const indianOffset = -330; // -5:30 hours in minutes
      const offsetDiff = indianOffset - userTimezoneOffset;

      return new Date(adjustedDate.getTime() - offsetDiff * 60000);
    } catch (error) {
      console.error("Date adjustment error:", error);
      return null;
    }
  };

  const DateTimePicker = () => {
    return (
      <div className="flex flex-col w-full gap-4">
        <Label htmlFor="publishDateTime">Schedule Post </Label>
        <div className="flex gap-4">
          <Input
            type="date"
            value={
              formData.publishDate
                ? format(formData.publishDate, "yyyy-MM-dd")
                : ""
            }
            onChange={(e) => {
              const selectedDate = e.target.value
                ? new Date(e.target.value)
                : null;
              handleInputChange("publishDate", selectedDate);
            }}
            min={format(new Date(), "yyyy-MM-dd")}
            className="w-full"
          />
          <Input
            type="time"
            value={formData.publishTime}
            onChange={(e) => handleInputChange("publishTime", e.target.value)}
            className="w-1/2"
            disabled={!formData.publishDate}
          />
        </div>
      </div>
    );
  };

  const renderFields = () => {
    switch (formData.selectedType) {
      case "manual":
        return (
          <div className="space-y-6">
            <div className="flex flex-col w-full gap-4">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                placeholder="Enter your text"
                value={formData.text}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("text", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col w-full gap-4">
              <Label htmlFor="file">Image Upload</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {fileError && (
                <span className="text-sm text-red-500">{fileError}</span>
              )}
              {formData.filePreview && (
                <div className="mt-2">
                  <img
                    src={formData.filePreview}
                    alt="Preview"
                    className="max-w-full h-auto max-h-40 rounded-lg"
                  />
                </div>
              )}
            </div>
            <DateTimePicker />
          </div>
        );

      case "automated":
        return (
          <div className="space-y-6">
            <DateTimePicker />
          </div>
        );

      case "only-automate-content-with-prompt":
        return (
          <div className="space-y-6">
            <div className="flex flex-col w-full gap-4">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                placeholder="Enter your prompt"
                value={formData.prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("prompt", e.target.value)
                }
              />
            </div>
            <DateTimePicker />
          </div>
        );

      case "only-automate-image-with-prompt":
        return (
          <div className="space-y-6">
            <div className="flex flex-col w-full gap-4">
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                placeholder="Enter your text"
                value={formData.text}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("text", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col w-full gap-4">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                placeholder="Enter your prompt"
                value={formData.prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("prompt", e.target.value)
                }
              />
            </div>
            <DateTimePicker />
          </div>
        );

      case "automate-with-prompt":
        return (
          <div className="space-y-6">
            <div className="flex flex-col w-full gap-4">
              <Label htmlFor="prompt">Prompt</Label>
              <Input
                id="prompt"
                placeholder="Enter your prompt"
                value={formData.prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("prompt", e.target.value)
                }
              />
            </div>
            <DateTimePicker />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Generate Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-0">
        <DialogHeader>
          <DialogTitle>Generate Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            onValueChange={(value: UploadType) =>
              handleInputChange("selectedType", value)
            }
          >
            <SelectTrigger className="w-full mt-8">
              <SelectValue placeholder="Select a Upload Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="!mt-10">{renderFields()}</div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={generatePost}
            disabled={loading || !formData.selectedType}
          >
            {loading ? "Generating..." : "Generate Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
