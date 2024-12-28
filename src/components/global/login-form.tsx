"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LogoText from "./logo-txt";

// Access environment variable
const BACKEND_URI =
  process.env.NEXT_PUBLIC_BACKEND_URI || "https://api.bot.thesquirrel.site";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URI}/admin/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.token) {
        localStorage.setItem("adminToken", response.data.token);
        router.push("/dashboard");
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error || "Login failed. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-sm w-full">
      <Card className="w-full rounded-xl py-6 bg-secondary border-0 dark:bg-darkSecondary">
        <CardHeader>
          <CardTitle className="text-center">
            <LogoText />
          </CardTitle>
          <CardDescription className="text-center">
            Please enter your credentials to Login
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mt-2">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full border-0 bg-lightPrimary/50 dark:bg-darkPrimary/50"
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                className="border-0 bg-lightPrimary/50 dark:bg-darkPrimary/50"
                type="password"
                placeholder="enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-3 text-white" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="text-center mt-4 text-xs text-gray-500 mx-auto max-w-[200px]">
        By clicking on Log In you agree to our{" "}
        <span className="underline cursor-pointer text-lightAccent"> Terms and Conditions</span>
      </div>
    </section>
  );
};

export default LoginForm;
