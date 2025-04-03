"use client"
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/form";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Check, DiamondPlus } from "lucide-react";
import { Input } from "@components/ui/input";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});


export const UpgradePremiumDialog = () => {
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
      });
    
      function onSubmit(values) {
        console.log(values);
      }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-8 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 border-2 border-yellow-600 rounded-full py-3 flex justify-center items-center shadow-lg transform transition-transform hover:scale-105">
          <span className="text-base font-semibold text-white">
            Join Premium
          </span>
          <DiamondPlus className="ml-2 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[60vw] max-w-[60vw] h-[500px] bg-headerBg border-transparent gap-2 px-4 py-5 justify-center items-center flex flex-col space-y-6">
        <DialogHeader className="flex justify-start items-center flex-col space-y-1">
          <DialogTitle className="text-white text-3xl">
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-4 items-start w-full max-w-md">
          {[
            "Create Multiple Workspaces",
            "Connect multiple social media accounts.",
            "Create engaging threads with more posts per thread",
            "Schedule posts in advance for optimal engagement",
          ].map((item, i) => (
            <div key={i} className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-yellow-500" />
              <p className="text-white">{item}</p>
            </div>
          ))}
        </div>

        {/* Email Form */}
        <div className="w-full max-w-md mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white py-2 rounded-md"
              >
                Get Started
              </Button>
            </form>
          </Form>
        </div>

        {/* Contact Number */}
        <p className="text-gray-300 text-sm mt-2">
          Or call us at:{" "}
          <span className="text-yellow-400 font-medium">+91 94496 10077</span>
        </p>
      </DialogContent>
    </Dialog>
  );
};

