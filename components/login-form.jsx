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
import { useRouter } from "next/navigation";

import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import { Label } from "./ui/label";

export function LoginForm({ className, ...props }) {
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        "https://api.bot.thesquirrel.site/user/login",
        values
      );

      const token = response.data.data.token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex gap-2 items-center  ">
        <div className="rounded-full bg-white justify-center items-center h-24 w-24  flex ">
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
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
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <Label className="text-sm text-white">Password</Label>
                  <FormControl>
                    <Input
                      className="bg-[#1A1D1F] py-6 border-[#ffffff30]
                          focus:outline-none focus:ring-0   px-4  focus-visible:ring-0
                           focus-visible:ring-offset-0
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
            <div className="flex items-center justify-center flex-col space-y-2">
              <div className="flex w-full justify-end items-end">
                <Link
                  href={"/auth/forgetPassword"}
                  className="text-white underline font-medium text-base"
                >
                  Forget Password?
                </Link>
              </div>
              <Button type="submit" className="w-full text-white">
                Submit
              </Button>
            </div>
          </form>
        </Form>
        <div className="p-0 justify-center items-center">
          <p className="text-white text-base ">
            Don't Have an Account?{" "}
            <Link
              className="text-white text-base underline"
              href={"/auth/register"}
            >
              Register
            </Link>
          </p>
      </div>
    </div>
  );
}
