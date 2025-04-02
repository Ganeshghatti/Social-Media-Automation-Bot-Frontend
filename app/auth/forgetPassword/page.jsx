"use client";

import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
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
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Label } from "@components/ui/label";
import useAuthToken from "@/hooks/useAuthToken";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const ForgetPassword = () => {
  const token = useAuthToken();
  const router = useRouter();

  if (token) {
    router.push("/dashboard");
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await axios.post(
        "https://api.bot.thesquirrel.tech/user/forgot-password",
        values
      );
      if (response.status === 200) {
        toast("Email Sent");
      }
    } catch (error) {
      toast.error("Forget Password Failed");
      console.error("Forget Password Failed: ", error);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-navBg p-2">
      <div className="flex flex-col gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold text-white">
                Forgot Your Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to receive a reset link
              </p>
            </div>
            <div className="grid gap-6">
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full rounded-[10px] text-white"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;