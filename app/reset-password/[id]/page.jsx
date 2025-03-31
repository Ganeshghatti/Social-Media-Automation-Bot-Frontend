"use client";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@components/ui/label";

const page = ({ className, ...props }) => {
  const router = useRouter();
  const { id } = useParams();
  console.log("Id ", id);
  const formSchema = z
    .object({
      newPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
      confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match.",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        "https://api.bot.thesquirrel.tech/user/reset-password",
        {
          newPassword: values.newPassword,
          token: id,
        }
      );

      console.log("Response ", response);
      if (response.status === 200) {
        router.push(`/auth/login`);
      }
    } catch (error) {
      console.error("Reset Password failed:", error);
    }
  }

  return (
    <div className="h-screen w-screen overflow-x-hidden bg-navBg flex items-center justify-center p-2">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("flex flex-col gap-10", className)}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-white">
                Reset Your Password
              </h1>
            </div>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-white">New Password</Label>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-white">Confirm Password</Label>
                    <FormControl>
                      <Input
                        placeholder="Confirm your password"
                        type="password"
                        className="bg-[#1A1D1F] border-[0.5px] border-[#D8DADC]/50 rounded-[10px] text-white"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full text-white">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default page;
