"use client";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
      const lowerCaseValues = {
        username: values.username.toLowerCase(),
        email: values.email.toLowerCase(),
        password: values.password.toLowerCase(),
        phone: values.phone.toLowerCase(),
      };

      const response = await axios.post(
        "https://api.bot.thesquirrel.site/user/signup",
        lowerCaseValues
      );

      if (response.data) {
        window.location.href = "/auth/verify";
      }
    } catch (error) {
      toast.error("Sigup Failed");
      console.error("Signup failed:", error);
      // You might want to show an error message to the user here
    }
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-10", className)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <FormControl>
                  <Input
                    id="username"
                    placeholder="Enter Your Username"
                    {...field}
                    value={field.value ?? ""}
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px] text-white"
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
              <FormItem className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Your Email"
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px] text-white"
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
              <FormItem className="grid gap-2">
                <Label htmlFor="phone" className="text-white">
                  Phone
                </Label>
                <FormControl>
                  <Input
                    id="phone"
                    placeholder="Enter Your Phone"
                    {...field}
                    value={field.value ?? ""}
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px] text-white"
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
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      {...field}
                      value={field.value ?? ""}
                      className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px] text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
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
          <Button type="submit" className="w-full rounded-[10px] text-white">
            Submit
          </Button>
        </div>
        <div className="text-center text-sm text-white/50">
          Already have an account?{"  "}
          <Link
            href="/auth/login"
            className="underline underline-offset-4 pl-1 text-primary"
          >
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
