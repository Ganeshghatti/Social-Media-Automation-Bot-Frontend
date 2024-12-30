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
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Edit, ImageOff } from "lucide-react";
import axios from "axios";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.bot.thesquirrel.site";

interface UpdateModalProps {
  initialData: {
    id: string;
    text: string;
    img: string;
    tobePublishedAt: string;
  };
  fetchPost: () => void;
}

export default function TwitterUpdateModal({
  initialData,
  fetchPost,
}: UpdateModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...initialData,
    file: null as File | null,
    filePreview: initialData.img || null,
  });
  const [fileError, setFileError] = useState<string | null>(null);
  const [publishDate, setPublishDate] = useState<Date | null>(
    new Date(initialData.tobePublishedAt)
  );
  const [publishTime, setPublishTime] = useState(
    format(new Date(initialData.tobePublishedAt), "HH:mm")
  );

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "file") {
      setFileError(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError("Please upload a valid image file (JPEG, PNG, or GIF)");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size should be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    handleInputChange("file", file);
    handleInputChange("filePreview", previewUrl);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const adjustedDateTime = adjustDateTimeForTimezone(
        publishDate,
        publishTime
      );
      if (!adjustedDateTime) throw new Error("Invalid date/time");

      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Authentication token not found");

      const updateData = new FormData();
      updateData.append("id", formData.id);
      updateData.append("text", formData.text);
      if (formData.file) updateData.append("img", formData.file);
      updateData.append("tobePublishedAt", adjustedDateTime.toISOString());

      const response = await axios.put(
        `${BACKEND_URI}/twitter/edit-post`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        await fetchPost();

        alert("Post updated successfully");

        setOpen(false);
      } else {
        throw new Error(response.data.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error instanceof Error ? error.message : "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const adjustDateTimeForTimezone = (
    date: Date | null,
    time: string
  ): Date | null => {
    if (!date) return null;
    const [hours, minutes] = time.split(":").map(Number);
    const adjustedDate = new Date(date);
    adjustedDate.setHours(hours, minutes, 0, 0);
    return adjustedDate;
  };

  const ImagePreview = () => {
    if (formData.filePreview) {
      return (
        <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={formData.filePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md">
        <ImageOff className="w-8 h-8 text-gray-400" />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Twitter Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate}>
          <div className="flex flex-col gap-4 py-4">
            <div>
              <Label htmlFor="text">Text</Label>
              <Input
                id="text"
                value={formData.text}
                onChange={(e) => handleInputChange("text", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="file">Upload image</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {fileError && (
                <p className="text-red-500 text-sm mt-1">{fileError}</p>
              )}
            </div>
            <ImagePreview />
            <div>
              <Label htmlFor="publishDate">Schedule Post</Label>
              <div className="flex gap-4">
                <Input
                  type="date"
                  value={publishDate ? format(publishDate, "yyyy-MM-dd") : ""}
                  onChange={(e) => setPublishDate(new Date(e.target.value))}
                />
                <Input
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
