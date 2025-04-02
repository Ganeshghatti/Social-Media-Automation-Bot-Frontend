"use client";
import React, { useState, useId } from "react";
import { Search, X, ImageIcon, Upload } from 'lucide-react';
import axios from 'axios';
import { Button } from "@components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import Image from "next/image";

const ThreadImageSelector = ({ token, postIndex, selectedImages, onImageSelect }) => {
  const [searchSource, setSearchSource] = useState("google");
  const [searchType, setSearchType] = useState("prompt");
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState([]);
  const [aiImage, setAiImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const componentId = useId();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const currentFiles = selectedImages || [];

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 30 * 1024 * 1024; // 30MB

    if (totalSize > maxTotalSize) {
      setError("Total size of all files cannot exceed 30MB");
      return;
    }

    if (currentFiles.length + files.length > 4) {
      setError("You can only upload a maximum of 4 files.");
      return;
    }

    // Stricter file type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setError("Please only upload supported image types (JPG, PNG, GIF)");
      return;
    }

    // Process valid files
    const newImages = files.map((file) => ({
      originalname: file.name,
      size: file.size,
      mimetype: file.type,
      imageUrl: URL.createObjectURL(file),
      blobUrl: URL.createObjectURL(file),
      type: 'blob',
      file: file // Keep the file object for upload
    }));

    // Update selected images
    onImageSelect(postIndex, [...currentFiles, ...newImages]);
    setError(null);
  };

  const isImageSelected = (imageUrl) => {
    return selectedImages?.some(img => img.imageUrl === imageUrl);
  };

  const fetchImages = async (data) => {
    try {
      const endpoint = searchSource === 'google' 
        ? '/content/fetch-google-image'
        : '/content/generate-ai-img';

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}${endpoint}`, 
        {
          ...(data.prompt && { prompt: data.prompt }),
          ...(data.postcontent && { postcontent: data.postcontent }),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          ...(searchSource === 'ai' && { responseType: 'blob' })
        }
      );

      if (searchSource === 'google') {
        if (response.data?.success && response.data?.data?.images) {
          return response.data.data.images;
        }
        throw new Error("Invalid response structure");
      } else {
        const blobUrl = URL.createObjectURL(response.data);
        return blobUrl;
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a search value");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImages([]);
      setAiImage(null);

      const searchData = {
        [searchType]: inputValue,
      };

      const result = await fetchImages(searchData);
      
      if (searchSource === 'google') {
        setImages(result);
      } else {
        setAiImage(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (image) => {
    const currentImages = selectedImages || [];
    
    if (currentImages.length >= 4) {
      setError("You can only select up to 4 images");
      return;
    }

    let newImage;
    if (searchSource === 'google') {
      // Extract filename from URL
      const originalname = image.thumbnailUrl.split('/').pop() || 'image.jpg';
      newImage = {
        originalname,
        size: 0,
        mimetype: 'image/jpeg',
        imageUrl: image.thumbnailUrl,
        type: 'url'
      };
    } else if (searchSource === 'ai') {
      newImage = {
        originalname: 'ai-generated-image.jpg',
        size: 0,
        mimetype: 'image/jpeg',
        imageUrl: image,
        blobUrl: image,
        type: 'blob'
      };
    }
    
    const exists = currentImages.some(img => 
      img.type === 'blob' 
        ? img.blobUrl === newImage.blobUrl 
        : img.imageUrl === newImage.imageUrl
    );
    
    if (exists) {
      onImageSelect(postIndex, currentImages.filter(img => 
        img.type === 'blob' 
          ? img.blobUrl !== newImage.blobUrl 
          : img.imageUrl !== newImage.imageUrl
      ));
    } else {
      onImageSelect(postIndex, [...currentImages, newImage]);
    }
  };

  const handleRemoveImage = (imageToRemove) => {
    const currentImages = selectedImages || [];
    onImageSelect(
      postIndex,
      currentImages.filter(img => 
        img.type === 'blob' 
          ? img.blobUrl !== imageToRemove.blobUrl 
          : img.imageUrl !== imageToRemove.imageUrl
      )
    );
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Select value={searchSource} onValueChange={setSearchSource}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Search Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Google Images</SelectItem>
              <SelectItem value="ai">AI Generated</SelectItem>
              <SelectItem value="upload">Upload Image</SelectItem>
            </SelectContent>
          </Select>

          {searchSource !== 'upload' && (
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Search Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prompt">Prompt</SelectItem>
                <SelectItem value="postcontent">Post Content</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {searchSource === 'upload' ? (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button 
              type="button"
              variant="outline"
              onClick={() => document.querySelector('input[type="file"]').click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter search term..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Button 
              type="button"
              onClick={() => handleSearch()} 
              disabled={loading}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Selected Images Display */}
      {selectedImages && selectedImages.length > 0 && (
        <div className="mb-4">
          <Label>Selected Images</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="relative w-20 h-20">
                  <img
                    src={img.type === 'blob' ? img.blobUrl : img.imageUrl}
                    alt={`Selected ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(img);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {searchSource === 'google' && images.map((image, idx) => (
            <div
              key={idx}
              className={`relative cursor-pointer group ${
                isImageSelected(image.thumbnailUrl) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <div className="relative w-full h-24">
                <img
                  src={image.thumbnailUrl}
                  alt={`Result ${idx + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                />
              </div>
            </div>
          ))}
          {searchSource === 'ai' && aiImage && (
            <div
              className={`relative cursor-pointer group ${
                isImageSelected(aiImage) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleImageSelect(aiImage)}
            >
              <div className="relative w-full h-24">
                <img
                  src={aiImage}
                  alt="AI Generated Image"
                  className="w-full h-24 object-cover rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreadImageSelector;
