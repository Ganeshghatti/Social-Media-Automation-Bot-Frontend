"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";

import axios from "axios";
import useAuthToken from "@hooks/useAuthToken";
import { CustomLoader } from "@/components/global/CustomLoader";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

const Page = () => {
  const token = useAuthToken();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { logout } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://api.bot.thesquirrel.tech/user/profile",
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

    if (token) {
      fetchProfile();
    }
  }, [token]);

  if (loading || !userData) {
    return <CustomLoader />;
  }

  return (
    <div className="min-h-screen w-full flex items-center p-4 md:p-8 bg-navBg overflow-x-hidden">
      <Card className="w-full max-w-lg mx-auto bg-headerBg">
        <CardHeader className="text-center text-white">
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
              <h2 className="text-2xl text-white font-bold">
                {userData?.username}
              </h2>
              <p className="text-white">{userData?.email}</p>
            </div>

            <div className="w-full space-y-4">
              <div>
                <Label className="text-white/80">Bio</Label>
                <p className="text-white">
                  A passionate developer who loves to code.
                </p>
              </div>
              <div>
                <Label className="text-white/80">Phone</Label>
                <p className="text-white">{userData.phone}</p>
              </div>
              <div>
                <Label className="text-white/80">Role</Label>
                <p className="text-white capitalize">{userData.role}</p>
              </div>

              <div>
                <Label className="text-white/80">Subscription</Label>
                <p className="text-white capitalize">{userData.subscription}</p>
              </div>

              <Button className="w-full capitalize text-white">
                Edit Profile
              </Button>
              <Button
                onClick={() => {
                  logout();
                  router.replace("/auth/login");
                }}
                className="w-full capitalize hover:bg-red-700 bg-red-600 text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
