import React, { useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";
import Image from "next/image";
import { CustomTextarea } from "../global/CustomTextarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  threadNumber,
  value,
  onChange,
  setCards,
  cards,
  textareaRef,
  setNewCardAdded,
  isFirst, // New prop to indicate if this is the first card
  isLast, // New prop to indicate if this is the last card
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageDialogType, setImageDialogType] = useState(""); // "upload", "ai", "search"
  const fileInputRef = useRef(null);
  
  // For AI and Google Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("prompt");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (selectedImages.length + files.length > 4) {
      setError("You can only upload a maximum of 4 images");
      return;
    }
    
    // Validate file types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError("Please only upload supported image types (JPG, PNG, GIF)");
      return;
    }
    
    // Validate file size
    const maxSize = 8 * 1024 * 1024; // 8MB per file
    const oversizedFiles = files.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError("Each file must be under 8MB");
      return;
    }
    
    // Create image objects
    const newImages = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file: file,
      type: 'blob',
      imageUrl: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimetype: file.type
    }));
    
    setSelectedImages(prev => [...prev, ...newImages]);
    setError("");
    setShowImageDialog(false);
  };
  
  // Handle AI image generation
  const generateAIImage = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a prompt for image generation");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const endpoint = '/content/generate-ai-img';
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}${endpoint}`,
        {
          [searchType]: searchQuery
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );
      
      const blobUrl = URL.createObjectURL(response.data);
      
      // Add the AI-generated image to selected images
      setSelectedImages(prev => [
        ...prev, 
        {
          id: Date.now() + Math.random().toString(36).substring(2, 9),
          type: 'blob',
          imageUrl: blobUrl,
          name: 'ai-generated-image.jpg',
          size: 0,
          mimetype: 'image/jpeg'
        }
      ]);
      
      setShowImageDialog(false);
    } catch (error) {
      console.error("Error generating AI image:", error);
      setError("Failed to generate AI image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle Google image search
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
      const endpoint = '/content/fetch-google-image';
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}${endpoint}`,
        {
          [searchType]: searchQuery
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data?.success && response.data?.data?.images) {
        setSearchResults(response.data.data.images);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error searching images:", error);
      setError("Failed to search images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selecting an image from search results
  const selectSearchImage = (image) => {
    if (selectedImages.length >= 4) {
      setError("You can only select up to 4 images");
      return;
    }
    
    // Extract filename from URL
    const originalname = image.thumbnailUrl.split('/').pop() || 'image.jpg';
    
    setSelectedImages(prev => [
      ...prev,
      {
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        type: 'url',
        imageUrl: image.thumbnailUrl,
        name: originalname,
        size: 0,
        mimetype: 'image/jpeg'
      }
    ]);
    
    setShowImageDialog(false);
  };
  
  // Remove an image from selected images
  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
  };
  
  // Open the appropriate dialog based on selection
  const openImageDialog = (type) => {
    setImageDialogType(type);
    setSearchQuery("");
    setSearchResults([]);
    setError("");
    setShowImageDialog(true);
    
    if (type === "upload") {
      // Trigger file input click
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }, 100);
    }
  };

  return (
    <Card className="w-2/4 flex flex-row gap-4 bg-transparent h-full h-full border-transparent mx-auto ">
      {/* Thread/Line Container */}
      <CardTitle className="p-0 justify-between flex gap-4 h-full items-center">
        <div className="flex gap-4 items-center justify-center h-full ">
          {" "}
          {/* Added padding for thread */}
          <div className="relative h-full  ">
            <Image alt="Profile" src="/profile.png" height={50} width={50} />
            <div className="bg-[#FFFFFF33] absolute left-1/2 h-[90%] w-[1px]" />
          </div>
        </div>
      </CardTitle>
      <div className="flex h-full w-full flex-col gap-4 justify-between">
        <div className="flex flex-1 w-full items-center justify-between ">
          <h2 className="font-semibold text-xl text-white">Jatin</h2>

          <div className="w-8 h-8 bg-headerBg rounded-sm cursor-pointer flex justify-center items-center">
            <Image
              src="/ThreeDots.png"
              alt="More"
              width={20}
              height={20}
              className="h-5 w-5 object-contain"
            />
          </div>
        </div>
        <CardContent className="w-full p-0 justify-start items-start flex">
          <CustomTextarea value={value} onChange={onChange} ref={textareaRef} />
        </CardContent>
        
        {/* Display selected images */}
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedImages.map((img) => (
              <div key={img.id} className="relative group flex gap-2">
                <img
                  src={img.imageUrl}
                  alt={img.name}
                  className="max-w-[400px] w-full aspect-ratio object-cover rounded-md"
                />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
              setCards((prev) => [...prev, { id: prev.length, text: "" }]);
              setNewCardAdded(true);
            }}
            className="w-8 h-8 rounded-sm flex bg-headerBg justify-center items-center cursor-pointer"
          >
            <Image
              src={"/AddSquirrel.png"}
              alt="AddSquirrel "
              height={200}
              width={200}
              className="object-contain h-5 w-5"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-8 h-8 flex bg-headerBg rounded-sm justify-center items-center cursor-pointer">
                <Image
                  src={"/SquireelGallery.png"}
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
                  <Image
                    alt="Image"
                    src={"/Upload.png"}
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
                  <Image
                    alt="Image"
                    src={"/Gemini.png"}
                    height={20}
                    quality={100}
                    width={20}
                    className="object-contain h-5 w-5"
                  />
                </div>
              </div>
              <div 
                className="flex gap-3 bg-[#2C3032] rounded-md hover:bg-[#2C3032] hover:opacity-100 px-2 justify-between py-1 items-center cursor-pointer"
                onClick={() => openImageDialog("search")}
              >
                <span className="text-white text-sm">Google Search</span>
                <div className="flex items-center justify-center bg-headerBg px-1 py-1 rounded-md">
                  <Image
                    alt="Image"
                    src={"/Search.png"}
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
      
      {/* Hidden file input for uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      {/* Dialog for AI and Search */}
      <Dialog open={showImageDialog && imageDialogType !== "upload"} onOpenChange={setShowImageDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {imageDialogType === "ai" ? "Generate AI Image" : "Search Google Images"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Search Type</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select search type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prompt">Custom Prompt</SelectItem>
                  <SelectItem value="postcontent">Use Post Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>{searchType === "prompt" ? "Enter Prompt" : "Post Content"}</Label>
              {searchType === "prompt" ? (
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={imageDialogType === "ai" ? "Describe the image you want to generate..." : "Enter search term..."}
                />
              ) : (
                <textarea
                  value={value}
                  readOnly
                  className="w-full p-2 border rounded-lg resize-y min-h-[100px]"
                />
              )}
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <Button 
              onClick={imageDialogType === "ai" ? generateAIImage : searchGoogleImages}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : imageDialogType === "ai" ? "Generate Image" : "Search Images"}
            </Button>
            
            {/* Search Results */}
            {imageDialogType === "search" && searchResults.length > 0 && (
              <div className="mt-4">
                <Label>Search Results</Label>
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
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <p className="text-xs truncate mt-1">{image.title}</p>
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
