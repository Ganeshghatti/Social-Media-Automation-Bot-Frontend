"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import axios from "axios";
import useAuthToken from "@/hooks/useAuthToken";

const Page = () => {
  const token = useAuthToken();


  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
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
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (!userData) {
    return <div>Loading...</div>;
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
                {userData.username[0]}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">{userData?.username}</h2>
              <p className="text-gray-500">{userData?.email}</p>
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
                <p className="text-gray-600 capitalize">{userData.phone}</p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="text-gray-600 capitalize">{userData.role}</p>
              </div>

              <div>
                <Label>Subscription</Label>
                <p className="text-gray-600 capitalize">
                  {userData.subscription}
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
