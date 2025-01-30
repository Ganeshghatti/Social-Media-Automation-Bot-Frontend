"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import useAuthToken from "@/hooks/useAuthToken";

const Page = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthToken();

  // Fetch user data only if token is available
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://api.bot.thesquirrel.site/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please log in to view your profile.</p>
            <Button className="mt-4">Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center p-8 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl font-bold">
                {userData?.username?.[0] || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">
                {userData?.username || "Unknown User"}
              </h2>
              <p className="text-gray-500">
                {userData?.email || "No email provided"}
              </p>
            </div>

            <div className="w-full space-y-4">
              <div>
                <Label>Bio</Label>
                <p className="text-gray-600">
                  A passionate developer who loves to code.
                </p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-gray-600 capitalize">
                  {userData?.phone || "Not available"}
                </p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-gray-600 capitalize">
                  {userData?.role || "User"}
                </p>
              </div>
              <div>
                <Label>Subscription</Label>
                <p className="text-gray-600 capitalize">
                  {userData?.subscription || "None"}
                </p>
              </div>

              <Button className="w-full capitalize">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
