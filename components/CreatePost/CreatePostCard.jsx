"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import Image from "next/image";
import { CustomTextarea } from "../global/CustomTextarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import {
  Ellipsis,
  Images,
  Plus,
  Search,
  Sparkles,
  Trash,
  Upload,
} from "lucide-react";
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
  cards,
  setPostType,
  cardId,
  width,
}) => {
  const { user, setUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageDialogType, setImageDialogType] = useState("");
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("prompt");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.pointerEvents = "auto";
  }, [showImageDialog]);

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
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
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
    <Card
      className={`w-full sm:w-full 
        flex flex-row gap-4 bg-transparent h-full max-h-[240px] 
        border-transparent mx-auto 
        ${
          !width
            ? "md:w-[60vw] lg:w-[70vw] xl:w-[55vw] min-w-[240px] max-w-[1440px] "
            : "w-full"
        }
        `}
    >
      <CardTitle className="p-0 justify-between   flex gap-4 h-full items-center">
        <div className="flex gap-4 items-center justify-center  h-full ">
          <div className="relative h-full  ">
            {/* <Image
              alt="Profile"
              src={
                user && user?.profilePicture
                  ? user?.profilePicture
                  : "/Default_pic.jpg"
              }
              height={40}
              width={40}
              className="rounded-full object-cover"
            /> */}
            <div className="bg-[#FFFFFF33] absolute left-1/2 h-[90%] w-[1px]" />
          </div>
        </div>
      </CardTitle>
      <div className="flex h-full w-full  flex-col gap-4   justify-between">
        <div className="flex flex-1 w-full items-center justify-between ">
          <h2 className="font-medium text-lg text-white">{user?.username}</h2>
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 hover:bg-headerBg rounded-sm cursor-pointer flex justify-center items-center">
                <Image
                  src="/ThreeDots.svg"
                  alt="More"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="rounded-lg p-0 min-w-[140px] 
            flex flex-col gap-2 bg-headerBg border-[0.5px] border-transparent"
            >
              <div
                onClick={() => {
                  if (cards.length > 1) {
                    setCards(cards.filter((card) => card.id !== cardId));
                  }
                  if (cards.length <= 1) setPostType("post");
                  setIsOpen(false);
                }}
                className="flex gap-3  bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-4 justify-between py-3 items-center cursor-pointer"
              >
                <span className="text-white text-xs">Delete</span>
                <Trash className="object-contain h-4 w-4 text-red-600" />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
              setCards((prev) => [
                ...prev,
                { id: prev.length, text: "", media: [] },
              ]);
              setNewCardAdded(true);
            }}
            className="w-8 h-8 rounded-sm flex hover:bg-headerBg  justify-center items-center cursor-pointer"
          >
            <Image
              src="/AddSquirrel.svg"
              alt="AddSquirrel"
              height={20}
              width={20}
              className="object-contain h-4 w-4"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 flex  rounded-sm  hover:bg-headerBg justify-center items-center cursor-pointer">
                <Image
                  src={"/SquireelGallery.svg"}
                  alt="SquireelGallery"
                  height={200}
                  width={200}
                  className="object-contain h-5 w-5"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg px-2 py-2 min-w-[140px] flex flex-col gap-2 bg-headerBg border-[0.5px] border-[#ffffff32]">
              <div
                className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer"
                onClick={() => openImageDialog("upload")}
              >
                <span className="text-white text-sm">User Upload</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Upload className="object-contain h-5 w-5 text-white" />
                  <Image
                    alt="Image"
                    src="/Upload.png"
                    height={20}
                    quality={100}
                    width={20}
                    className="object-contain h-5 w-5"
                  />
                </div>
              </div>
              <div
                className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer"
                onClick={() => openImageDialog("ai")}
              >
                <span className="text-white text-sm">Ai Generated</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Sparkles className="object-contain text-purple-900 h-5 w-5" />
                </div>
              </div>
              <div
                className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer"
                onClick={() => openImageDialog("search")}
              >
                <span className="text-white text-sm">Google Search</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Search className="object-contain h-5 w-5 text-white" />
                  <Image
                    alt="Image"
                    src="/Search.png"
                    height={20}
                    quality={100}
                    width={20}
                    className="object-contain h-5 w-5"
                  />
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
      <Dialog
        open={showImageDialog && imageDialogType !== "upload"}
        onOpenChange={setShowImageDialog}
      >
        <DialogContent className="sm:max-w-[500px] bg-headerBg border-[0.5px] border-[#ffffff32] rounded-lg p-4 text-white">
          <DialogHeader className="flex flex-row items-center justify-between mb-4">
            <DialogTitle className="text-lg font-semibold">
              {imageDialogType === "ai"
                ? "Generate AI Image"
                : "Search Google Images"}
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
                  placeholder={
                    imageDialogType === "ai"
                      ? "Describe the image you want to generate..."
                      : "Enter search term..."
                  }
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
              onClick={
                imageDialogType === "ai" ? generateAIImage : searchGoogleImages
              }
              disabled={isLoading}
              className="w-full bg-[#2C3032] hover:bg-[#3C4042] text-white rounded-md transition-colors"
            >
              {isLoading
                ? "Processing..."
                : imageDialogType === "ai"
                ? "Generate Image"
                : "Search Images"}
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
                      <img
                        src={image.thumbnailUrl}
                        alt={image.title}
                        className="w-full h-32 object-cover rounded-md border border-[#ffffff32]"
                      />
                      <p className="text-xs truncate mt-1 text-gray-300">
                        {image.title}
                      </p>
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
