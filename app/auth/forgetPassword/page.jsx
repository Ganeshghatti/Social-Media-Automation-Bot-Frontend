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
import { useRouter } from "next/navigation";

import axios from "axios";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ForgetPassword = () => {
  const router = useRouter();

  const formSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        "https://api.bot.thesquirrel.site/user/forgot-password",
        values
      );
      if (response.status===200) {
        alert("Email Sent")
      }
 
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }
  return (
    <div className="h-screen w-screen overflow-x-hidden bg-navBg flex items-center justify-center p-2">
      <div className={"flex flex-col gap-6 "}>
        <Card className="w-[60vh]">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="text-2xl">Forget Password</CardTitle>
            <CardDescription>
              Enter your email below to get the link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="enter your email"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgetPassword;
