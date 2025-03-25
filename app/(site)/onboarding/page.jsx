"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { X } from "lucide-react";

import axios from "axios";
import useAuthToken from "@hooks/useAuthToken";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { cn } from "@lib/utils";

const formSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  keywords: z.string(),
});

const Page = ({ className="" }) => {
  const token = useAuthToken();
  const [keywords, setKeywords] = useState([]);
  const { user } = useUserStore();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      keywords: "",
    },
  });

  const addKeyword = (value) => {
    if (value && !keywords.includes(value)) {
      setKeywords([...keywords, value]);
      form.setValue("keywords", ""); // Correct field name
    }
  };
  

  useEffect(() => {
    if (user?.onboarding) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  if (user === null)
    return (
      <div className="flex flex-col">
        <h1 className="text-2xl">Loading...</h1>
      </div>
    );

    const onSubmit = async (data) => {
      try {
        await axios.post(
          "https://api.bot.thesquirrel.site/user/welcome",
          { description: data.description, keywords }, // Ensure correct structure
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        form.reset(); // Reset form after success
        setKeywords([]); // Clear keywords array
        router.push("/dashboard");
      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
      }
    };
    
  return (
    <div
      className={cn(
        "flex flex-col gap-6  flex-[0.4] mx-auto h-full items-start bg-navBg    justify-center ",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl text-white font-normal">Onboarding Page</h1>
      </div>
      <Card className="w-full md:w-[60vh] px-0 bg-transparent border-transparent">
        <CardContent className="px-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        placeholder="Enter description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Keywords</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          className="text-black"
                          placeholder="Add keyword"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addKeyword(field.value);
                            }
                          }}
                          {...field}
                        />
                        <Button
                          type="button"
                          onClick={() => addKeyword(field.value)}
                        >
                          Add
                        </Button>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center text-black gap-1 bg-secondary px-3 py-1 rounded-full"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="text-muted-foreground text-black hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
