'use client'
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

export function GenerateModal() {
  const [formData, setFormData] = useState<FormData>({
    selectedType: "",
    text: "",
    prompt: "",
    file: null,
    publishDate: null,
    publishTime: "10:00" // default time
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const adjustDateTimeForTimezone = (date: Date, time: string): Date | null => {
    try {
      if (!date) return null;
      
      const [hours, minutes] = time.split(':').map(Number);
      let adjustedDate = new Date(date);
      
      // Set the time
      adjustedDate.setHours(hours, minutes, 0, 0);
      
      // Create a new date with timezone offset
      const userTimezoneOffset = adjustedDate.getTimezoneOffset();
      const indianOffset = -330; // -5:30 hours in minutes
      const offsetDiff = indianOffset - userTimezoneOffset;
      
      // Adjust for Indian timezone
      return new Date(adjustedDate.getTime() - offsetDiff * 60000);
    } catch (error) {
      console.error("Date adjustment error:", error);
      return null;
    }
  };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null;
  //   handleInputChange("file", file);
  // };

  const generatePost = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      let uploadData: Record<string, any> = {
        action: formData.selectedType,
      };

      console.log("before up", uploadData, formData)

      if (formData.publishDate && formData.publishTime) {
        const adjustedDateTime = adjustDateTimeForTimezone(formData.publishDate, formData.publishTime);
        if (adjustedDateTime) {
          uploadData.tobePublishedAt = adjustedDateTime.toISOString();
        }
      }

      // Add additional fields based on selected type
      switch (formData.selectedType) {
        case "manual":
          if (!formData.text) throw new Error("Text is required for manual posts");
          uploadData = {
            ...uploadData,
            text: formData.text,
          };
          break;
          
        case "only-automate-content-with-prompt":
          if (!formData.prompt) throw new Error("Prompt is required for automated content");
          uploadData = {
            ...uploadData,
            prompt: formData.prompt,
          };
          break;

        case "only-automate-image-with-prompt":
          if (!formData.text || !formData.prompt) {
            throw new Error("Both text and prompt are required for automated image posts");
          }
          uploadData = {
            ...uploadData,
            text: formData.text,
            prompt: formData.prompt,
          };
          break;

        case "automate-with-prompt":
          if (!formData.prompt) throw new Error("Prompt is required for automated posts");
          uploadData = {
            ...uploadData,
            prompt: formData.prompt,
          };
          break;

        case "automated":
          uploadData = {
            ...uploadData,
          };
          break;

        default:
          throw new Error("Invalid upload type selected");
      }

      console.log("upload data to be", uploadData)

      const response = await axios.post<GeneratePostResponse>(
        `${BACKEND_URI}/twitter/create-post`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Reset form and close dialog
        setFormData({
          selectedType: "",
          text: "",
          prompt: "",
          file: null,
          publishDate: null,
          publishTime: "10:00"
        });
        console.log("post uplaoded succesfuly", response.data);
      } else {
        throw new Error(response.data.message || "Failed to generate post");
      }
    } catch (error) {
      console.error("Error generating post:", error);
      // You might want to add toast notification here
      // toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  const DateTimePicker = () => {
    return (
      <div className="flex flex-col w-full gap-4">
        <Label htmlFor="publishDateTime">Schedule Post </Label>
        <div className="flex gap-4">
          <Input
            type="date"
            value={formData.publishDate ? format(formData.publishDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const selectedDate = e.target.value ? new Date(e.target.value) : null;
              handleInputChange('publishDate', selectedDate);
            }}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="w-full"
          />
          <Input
            type="time"
            value={formData.publishTime}
            onChange={(e) => handleInputChange('publishTime', e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("text", e.target.value)}
              />
            </div>
            {/* <div className="flex flex-col w-full gap-4">
              <Label htmlFor="file">File</Label>
              <Input 
                id="file" 
                type="file"
                onChange={handleFileChange}
              />
            </div> */}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("prompt", e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("text", e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full gap-4">
              <Label htmlFor="prompt">Prompt</Label>
              <Input 
                id="prompt" 
                placeholder="Enter your prompt"
                value={formData.prompt}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("prompt", e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange("prompt", e.target.value)}
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
          <Select onValueChange={(value: UploadType) => handleInputChange("selectedType", value)}>
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
          
          <div className="!mt-10">
          {renderFields()}
          </div>
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