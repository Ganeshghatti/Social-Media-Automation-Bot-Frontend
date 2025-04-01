import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import Image from "next/image";
import { CustomTextarea } from "../global/CustomTextarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { X } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CreatePostCard = ({
  value,
  onChange,
  setCards,
  textareaRef,
  setNewCardAdded,
  selectedImages = [],
  onImageSelect,
}) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageDialogType, setImageDialogType] = useState("");
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("prompt");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showImageDialog) {
      document.body.style.pointerEvents = "auto";
    } else {
      document.body.style.pointerEvents = "auto";
    }
  }, [showImageDialog]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > 4) {
      setError("You can only upload a maximum of 4 images per post");
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError("Please only upload supported image types (JPG, PNG, GIF)");
      return;
    }
    const maxSize = 8 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError("Each file must be under 8MB");
      return;
    }

    const newImages = files.map((file) => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      type: "blob",
      imageUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimetype: file.type,
    }));
    onImageSelect([...selectedImages, ...newImages]);
    setShowImageDialog(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const generateAIImage = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a prompt for image generation");
      return;
    }
    if (selectedImages.length >= 4) {
      setError("You can only select up to 4 images per post");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/content/generate-ai-img`,
        { [searchType]: searchQuery },
        {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const blobUrl = URL.createObjectURL(response.data);
      onImageSelect([
        ...selectedImages,
        {
          id: Date.now() + Math.random().toString(36).substring(2, 9),
          type: "blob",
          imageUrl: blobUrl,
          name: "ai-generated-image.jpg",
          size: 0,
          mimetype: "image/jpeg",
        },
      ]);
      setShowImageDialog(false);
    } catch (error) {
      setError("Failed to generate AI image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchGoogleImages = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a search term");
      return;
    }
    setIsLoading(true);
    setError("");
    setSearchResults([]);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/content/fetch-google-image`,
        { [searchType]: searchQuery },
        { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } }
      );
      if (response.data?.success && response.data?.data?.images) {
        setSearchResults(response.data.data.images);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      setError("Failed to search images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectSearchImage = (image) => {
    if (selectedImages.length >= 4) {
      setError("You can only select up to 4 images per post");
      return;
    }
    const originalname = image.thumbnailUrl.split("/").pop() || "image.jpg";
    onImageSelect([
      ...selectedImages,
      {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        type: "url",
        imageUrl: image.thumbnailUrl,
        name: originalname,
        size: 0,
        mimetype: "image/jpeg",
      },
    ]);
    setError("");
  };

  const removeImage = (imageId) => {
    onImageSelect(selectedImages.filter((img) => img.id !== imageId));
  };

  const openImageDialog = (type) => {
    setImageDialogType(type);
    setSearchQuery("");
    setSearchResults([]);
    setError("");
    setShowImageDialog(true);
    if (type === "upload") {
      setTimeout(() => fileInputRef.current?.click(), 100);
    }
  };

  return (
    <Card className="w-2/4 flex flex-row gap-4 bg-transparent h-full border-transparent mx-auto">
      <CardTitle className="p-0 justify-between flex gap-4 h-full items-center">
        <div className="flex gap-4 items-center justify-center h-full">
          <div className="relative h-full">
            <div className="bg-[#FFFFFF33] absolute left-1/2 h-[100%] w-[1px]" />
          </div>
        </div>
      </CardTitle>
      <div className="flex py-10 h-full w-full flex-col gap-8">
        <div className="flex w-full items-center justify-between">
          <div className="w-8 h-8 bg-headerBg rounded-sm cursor-pointer flex justify-center items-center">
            <Image src="/ThreeDots.png" alt="More" width={20} height={20} className="h-5 w-5 object-contain" />
          </div>
        </div>
        <CardContent className="w-full border-2 rounded-md border-neutral-700 p-0 justify-start items-start flex">
          <CustomTextarea value={value} onChange={onChange} ref={textareaRef} />
        </CardContent>
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedImages.map((img) => (
              <div key={img.id} className="relative group w-36 h-36">
                <img
                  src={img.imageUrl}
                  alt={img.name}
                  className="w-full h-full object-cover rounded-md border border-gray-600"
                />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <CardFooter className="flex w-full gap-3 px-2 py-3 pt-1 justify-end items-center">
          <div
            onClick={() => {
              setCards((prev) => [...prev, { id: prev.length, text: "", media: [] }]);
              setNewCardAdded(true);
            }}
            className="w-8 h-8 rounded-sm flex bg-headerBg justify-center items-center cursor-pointer"
          >
            <Image src="/AddSquirrel.png" alt="AddSquirrel" height={200} width={200} className="object-contain h-5 w-5" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 flex bg-headerBg rounded-sm justify-center items-center cursor-pointer">
                <Image src="/SquireelGallery.png" alt="SquireelGallery" height={200} width={200} className="object-contain h-5 w-5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg px-2 py-2 min-w-[140px] flex flex-col gap-2 bg-headerBg border-[0.5px] border-[#ffffff32]">
              <div
                className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer"
                onClick={() => openImageDialog("upload")}
              >
                <span className="text-white text-sm">User Upload</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Image alt="Image" src="/Upload.png" height={20} quality={100} width={20} className="object-contain h-5 w-5" />
                </div>
              </div>
              <div
                className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer"
                onClick={() => openImageDialog("ai")}
              >
                <span className="text-white text-sm">Ai Generated</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Image alt="Image" src="/Gemini.png" height={20} quality={100} width={20} className="object-contain h-5 w-5" />
                </div>
              </div>
              <div
                className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer"
                onClick={() => openImageDialog("search")}
              >
                <span className="text-white text-sm">Google Search</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Image alt="Image" src="/Search.png" height={20} quality={100} width={20} className="object-contain h-5 w-5" />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
      <Dialog open={showImageDialog && imageDialogType !== "upload"} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-[500px] bg-headerBg border-[0.5px] border-[#ffffff32] rounded-lg p-4 text-white">
          <DialogHeader className="flex flex-row items-center justify-between mb-4">
            <DialogTitle className="text-lg font-semibold">
              {imageDialogType === "ai" ? "Generate AI Image" : "Search Google Images"}
            </DialogTitle>
            {/* <button
              onClick={() => setShowImageDialog(false)}
              className="bg-[#2C3032] p-1 rounded-full hover:bg-[#3C4042] transition-colors"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button> */}
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Search Type</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="bg-[#2C3032] border-[#ffffff32] text-white rounded-md">
                  <SelectValue placeholder="Select search type" />
                </SelectTrigger>
                <SelectContent className="bg-[#2C3032] border-[#ffffff32] text-white rounded-md">
                  <SelectItem value="prompt">Custom Prompt</SelectItem>
                  <SelectItem value="postcontent">Use Post Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">
                {searchType === "prompt" ? "Enter Prompt" : "Post Content"}
              </Label>
              {searchType === "prompt" ? (
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={imageDialogType === "ai" ? "Describe the image you want to generate..." : "Enter search term..."}
                  className="bg-[#2C3032] border-[#ffffff32] text-white rounded-md focus:ring-0 focus:border-[#ffffff64]"
                />
              ) : (
                <textarea
                  value={value}
                  readOnly
                  className="w-full p-2 bg-[#2C3032] border-[#ffffff32] text-white rounded-md resize-y min-h-[70px]"
                />
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              onClick={imageDialogType === "ai" ? generateAIImage : searchGoogleImages}
              disabled={isLoading}
              className="w-full bg-[#2C3032] hover:bg-[#3C4042] text-white rounded-md transition-colors"
            >
              {isLoading ? "Processing..." : imageDialogType === "ai" ? "Generate Image" : "Search Images"}
            </Button>
            {imageDialogType === "search" && searchResults.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm text-gray-300">Search Results</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-[300px] overflow-y-auto">
                  {searchResults.map((image, index) => (
                    <div
                      key={index}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => selectSearchImage(image)}
                    >
                      <img src={image.thumbnailUrl} alt={image.title} className="w-full h-32 object-cover rounded-md border border-[#ffffff32]" />
                      <p className="text-xs truncate mt-1 text-gray-300">{image.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};