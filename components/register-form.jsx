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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
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
                    required
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px]"
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
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px]"
                    {...field}
                    value={field.value ?? ""}
                    required
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
                    required
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px]"
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
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter Your Password"
                    {...field}
                    value={field.value ?? ""}
                    required
                    className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px]"
                  />
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
          Already have an account?{" "}
          <a
            href="/login"
            className="underline underline-offset-4 text-primary"
          >
            Login
          </a>
        </div>
      </form>
    </Form>
  );
}
