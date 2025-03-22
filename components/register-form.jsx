"use client";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import Image from "next/image";
import { Label } from "./ui/label";
import Link from "next/link";

export function RegisterForm({ className, ...props }) {
  const formSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        "https://api.bot.thesquirrel.site/user/signup",
        values
      );
      if (response.data) {
        window.location.href = "/auth/verify";
      }
    } catch (error) {
      console.error("Signup failed:", error);
      // You might want to show an error message to the user here
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6  flex-[0.4] mx-auto h-full items-start    justify-center ",
        className
      )}
      {...props}
    >
      <div className="flex gap-2 items-center  ">
        <div className="rounded-full bg-white justify-center items-center h-24 w-24 flex ">
          <Image
            src={"/sidebar_logo.png"}
            height={50}
            width={50}
            className="h-[60px] w-[60px] object-contain"
            alt="No Image"
          />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-2xl text-white font-bold">The</h1>
          <h1 className="text-2xl text-white font-semibold">Squirrel</h1>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl text-white font-normal">Get Started Now</h1>
        <p className="text-base  text-white">
          Enter your credentials to access your account
        </p>
      </div>
      <Card className="w-full md:w-[60vh] px-0 bg-transparent  border-transparent">
        <CardContent className="px-0 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem
                    className="flex-1 bg-navBg text-white gap-0 border 
                border-transparent "
                  >
                    <Label className="text-sm text-white">Username</Label>
                    <FormControl>
                      <Input
                        className="bg-[#1A1D1F] py-6 border-[#ffffff30]  focus:outline-none focus:ring-0   px-4  focus-visible:ring-0 focus-visible:ring-offset-0
                         text-[20px] placeholder:text-[20px] placeholder:text-[#ffffff60] overflow-hidden rounded-lg"
                        placeholder="Enter Your Username"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem
                    className="flex-1 bg-navBg text-white gap-0 border 
                border-transparent "
                  >
                    <Label className="text-sm text-white">Email</Label>
                    <FormControl>
                      <Input
                        className="bg-[#1A1D1F] py-6 border-[#ffffff30]  focus:outline-none focus:ring-0   px-4  focus-visible:ring-0 focus-visible:ring-offset-0
                         text-[20px] placeholder:text-[20px] placeholder:text-[#ffffff60] overflow-hidden rounded-lg"
                        placeholder="Enter Your Email"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem
                    className="flex-1 bg-navBg text-white gap-0 border 
                border-transparent "
                  >
                    <Label className="text-sm text-white">Phone</Label>
                    <FormControl>
                      <Input
                        className="bg-[#1A1D1F] py-6 border-[#ffffff30]  focus:outline-none focus:ring-0   px-4  focus-visible:ring-0 focus-visible:ring-offset-0
                         text-[20px] placeholder:text-[20px] placeholder:text-[#ffffff60] overflow-hidden rounded-lg"
                        placeholder="Enter Your phone"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem
                    className="flex-1 bg-navBg text-white gap-0 border 
                border-transparent "
                  >
                    <Label className="text-sm text-white">Password</Label>
                    <FormControl>
                      <Input
                        className="bg-[#1A1D1F] py-6 border-[#ffffff30]  focus:outline-none focus:ring-0   px-4  focus-visible:ring-0 focus-visible:ring-offset-0
                         text-[20px] placeholder:text-[20px] placeholder:text-[#ffffff60] overflow-hidden rounded-lg"
                        placeholder="Enter Your Password"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-white text-lg font-medium"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="p-0 justify-center items-center">
          <p className="text-white text-base ">
            Already Have an Account?{" "}
            <Link
              className="text-white text-base underline"
              href={"/auth/login"}
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
