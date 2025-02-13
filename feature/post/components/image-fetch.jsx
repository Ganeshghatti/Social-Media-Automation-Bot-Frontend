"use client";
import React, { useState } from "react";
import { Search } from 'lucide-react';
import axios from 'axios';
import { Button } from "@components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Label } from "@components/ui/label";

const ImageFetch = ({ token }) => {
  const [searchSource, setSearchSource] = useState("google"); // 'google' or 'ai'
  const [searchType, setSearchType] = useState("prompt");
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState([]);
  const [aiImage, setAiImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        // For AI-generated image, create blob URL
        const blobUrl = URL.createObjectURL(response.data);
        return blobUrl;
      }
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Authentication failed");
      }
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

  // Cleanup blob URL when component unmounts or when new search is made
  React.useEffect(() => {
    return () => {
      if (aiImage) {
        URL.revokeObjectURL(aiImage);
      }
    };
  }, [aiImage]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div className="space-y-6">
          {/* Search Source Select */}
         <div>
         <Label className="mb-2">Search Source</Label>
          <Select
            value={searchSource}
            onValueChange={setSearchSource}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select search source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">Search on Google</SelectItem>
              <SelectItem value="ai">Generate with AI</SelectItem>
            </SelectContent>
          </Select>
         </div>

          {/* Search Type Select */}
        <div>
        <Label className="mb-2 mt-4">Prompt Source</Label>
          <Select
            value={searchType}
            onValueChange={setSearchType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select search type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prompt">Search by Prompt</SelectItem>
              <SelectItem value="postcontent">Search by Post Content</SelectItem>
            </SelectContent>
          </Select>
        </div>
          
          <div className="flex-1">
            {searchType === 'prompt' ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter search prompt..."
                className="w-full p-2 border rounded-lg"
              />
            ) : (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter post content..."
                className="w-full p-2 border rounded-lg resize-y min-h-[100px]"
              />
            )}
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={loading}
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            <Search size={20} />
            {loading ? 'Processing...' : 'Search'}
          </Button>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* AI Generated Image */}
      {!loading && aiImage && searchSource === 'ai' && (
        <div className="flex justify-center">
          <div className="relative overflow-hidden rounded-lg shadow-md max-w-xl">
            <img
              src={aiImage}
              alt="AI Generated Image"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Google Images Grid */}
      {!loading && images.length > 0 && searchSource === 'google' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-md">
              <img
                src={image.thumbnailUrl}
                alt={image.title}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {image.title}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && !aiImage && !error && (
        <div className="text-center text-gray-500 p-8">
          Enter a search term and click search to find or generate images
        </div>
      )}
    </div>
  );
};

export default ImageFetch;