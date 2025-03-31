"use client";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";

import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useState } from "react";

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
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export function LoginForm({ className, ...props }) {
  const router = useRouter();
  const { fetchUser } = useUserStore();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const response = await axios.post(
        "https://api.bot.thesquirrel.tech/user/login",
        values
      );

      const token = response.data.data.token;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      if (token) {
        await fetchUser(token);

        if (useUserStore.getState().user?.onboarding) {
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding");
        }
      }
    } catch (error) {
      toast.error("Login Failed");
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <Label className="text-sm text-white">Email</Label>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px] text-white"
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
              <Label className="text-sm text-white" htmlFor="password">
                Password
              </Label>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px] text-white"
                    placeholder="Enter Your Password"
                    {...field}
                    value={field.value ?? ""}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="text-primary" size={18} />
                    ) : (
                      <EyeIcon className="text-white" size={18} />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center flex-col space-y-2">
          <div className="flex w-full justify-end items-end">
            <Link
              href={"/auth/forgetPassword"}
              className="text-white underline font-medium text-sm"
            >
              Forget Password?
            </Link>
          </div>
          <Button default={loading} type="submit" className="w-full text-white">
            Submit
          </Button>
        </div>
        <div className="text-center text-sm text-white/50">
          Don't have an Account?{"  "}
          <Link
            href="/auth/register"
            className="underline underline-offset-4 pl-1 text-primary"
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
}
