"use client";
import React, { useState, useId } from "react";
import { Search, Check } from 'lucide-react';
import axios from 'axios';
import { Button } from "@components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Label } from "@components/ui/label";

const ImageFetch = ({ token, selectedImages, setSelectedImages }) => {
  const [searchSource, setSearchSource] = useState("google");
  const [searchType, setSearchType] = useState("prompt");
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState([]);
  const [aiImage, setAiImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const componentId = useId();

  const isImageSelected = (imageUrl) => {
    return selectedImages.some(img => img.imageUrl === imageUrl);
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
      if (error.response?.status === 401) {
        throw new Error("Authentication failed");
      }
      console.error("Error fetching images:", error);
      throw error;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
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
    const imageUrl = image.thumbnailUrl;
    
    setSelectedImages(prev => {
      const exists = prev.some(img => img.imageUrl === imageUrl);
      if (exists) {
        return prev.filter(img => img.imageUrl !== imageUrl);
      }
      return [...prev, {
        id: `${componentId}-${Date.now()}`,
        imageUrl,
        title: image.title || 'AI Generated Image'
      }];
    });
  };

  React.useEffect(() => {
    return () => {
      if (aiImage) {
        URL.revokeObjectURL(aiImage);
      }
    };
  }, [aiImage]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div className="space-y-6">
          <div>
            <Label className="mb-2">Search Source</Label>
            <Select value={searchSource} onValueChange={setSearchSource}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select search source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Search on Google</SelectItem>
                <SelectItem value="ai">Generate with AI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 mt-4">Prompt Source</Label>
            <Select value={searchType} onValueChange={setSearchType}>
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
            type="submit"
            disabled={loading}
            size="lg"
            className="w-full flex items-center justify-center gap-2"
          >
            <Search size={20} />
            {loading ? 'Processing...' : 'Search'}
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {!loading && aiImage && searchSource === 'ai' && (
        <div className="flex justify-center">
          <div 
            className="relative overflow-hidden rounded-lg shadow-md max-w-xl group cursor-pointer"
            onClick={() => handleImageSelect({ thumbnailUrl: aiImage })}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {isImageSelected(aiImage) ? (
                <div className="bg-green-500 text-white p-2 rounded-full">
                  <Check size={24} />
                </div>
              ) : (
                <div className="text-white text-lg font-medium">Click to select</div>
              )}
            </div>
            <img
              src={aiImage}
              alt="AI Generated Image"
              className="w-full h-auto object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {!loading && images.length > 0 && searchSource === 'google' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div 
              key={`${componentId}-${index}`}
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => handleImageSelect(image)}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isImageSelected(image.thumbnailUrl) ? (
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <Check size={24} />
                  </div>
                ) : (
                  <div className="text-white text-lg font-medium">Click to select</div>
                )}
              </div>
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

      {!loading && images.length === 0 && !aiImage && !error && (
        <div className="text-center text-gray-500 p-8">
          Enter a search term and click search to find or generate images
        </div>
      )}
    </div>
  );
};

export default ImageFetch;