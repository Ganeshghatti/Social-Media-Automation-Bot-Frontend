"use client";

import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { PlusIcon, ChevronsUpDown, Layers, CalendarDays } from "lucide-react";

import { Sidebar_Card } from "../single-workspace/Sidebar_Card";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

export const UnifiedSidebar = ({ workspaceId, token }) => {
    const pathname = usePathname();
    const router = useRouter();

    const [singleWorkspace, setSingleWorkspace] = useState(null);
    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(false);

    const isDashboardPage = pathname?.includes("/dashboard") || pathname?.includes("/analytics");

    const getSingleWorkspace = useCallback(async () => {
        if (!workspaceId || !token) return;

        try {
            const res = await axios.get(
                `https://api.bot.thesquirrel.tech/workspace/get/${workspaceId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSingleWorkspace(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error("Error getting workspace");
        }
    }, [workspaceId, token]);

    const getAllWorkspaces = useCallback(async () => {
        if (!token) return;

        setLoading(true);
        try {
            const res = await axios.get(`https://api.bot.thesquirrel.tech/workspace/get`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
                const filtered = res.data.data.filter(w => w._id !== workspaceId);
                setWorkspaces(filtered);
            }
        } catch (err) {
            toast.error("Error getting all workspaces");
        } finally {
            setLoading(false);
        }
    }, [token, workspaceId]);

    useEffect(() => {
        getSingleWorkspace();
        getAllWorkspaces();
    }, [getSingleWorkspace, getAllWorkspaces]);

    return (
        <div className="md:flex hidden flex-col items-start justify-between w-64 bg-darkBg px-4 py-6 shadow-sm text-white no-scrollbar h-screen sticky top-0 self-start max-h-screen">
            {/* Header */}
            <div className="flex flex-col gap-14 items-center w-full">
                <div className="flex w-full items-center gap-4">
                    <Image src={"/sidebar_logo.png"} height={61} alt="Image" width={52} />
                    <div className="flex flex-col items-start">
                        <h1 className="text-white font-bold text-2xl">The</h1>
                        <h1 className="text-white font-bold text-2xl">Squirrel</h1>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="flex flex-col w-full gap-3">
                    {isDashboardPage ? (
                        <>
                            <Sidebar_Card
                                imageUrl={"/dashboard_icon.png"}
                                text={"Dashboard"}
                                onClickFunction={() => router.push("/dashboard")}
                            />
                            <Sidebar_Card
                                imageUrl={"/Analytics.png"}
                                text={"Analytics"}
                                onClickFunction={() => router.push("/analytics")}
                            />
                            <Sidebar_Card
                                icon={Layers}
                                text="Workspaces"
                                onClickFunction={() => router.push("/workspaces")}
                            />
                            <Sidebar_Card
                                icon={CalendarDays}
                                text={"Scheduled"}
                                onClickFunction={() => router.push("/scheduledPosts")}
                            />


                        </>
                    ) : (
                        <>
                            <Sidebar_Card
                                imageUrl={"/dashboard_icon.png"}
                                text={"Dashboard"}
                                onClickFunction={() => router.push("/dashboard")}
                            />
                            <Sidebar_Card
                                imageUrl={"/Analytics.png"}
                                text={"Analytics"}
                                onClickFunction={() => router.push("/analytics")}
                            />
                            <div className="w-full h-[1px] bg-white opacity-40" />
                            <Sidebar_Card
                                imageUrl={"/Create-Post.png"}
                                text={"Create post"}
                                onClickFunction={() => router.push(`/workspace/${workspaceId}`)}
                            />
                            <Sidebar_Card
                                imageUrl={"/edit.png"}
                                text={"Edit Workspace"}
                                onClickFunction={() => router.push(`/workspace/${workspaceId}/edit`)}
                            />

                            <Dialog>
                                <DialogTrigger className="py-6 rounded-xl w-full cursor-pointer px-3 flex items-center justify-start gap-3 bg-navBg font-semibold">
                                    <PlusIcon className="text-primary" />
                                    Add Account
                                </DialogTrigger>
                                <DialogContent className="bg-headerBg border-transparent flex gap-2 items-start px-4 py-3 md:py-9">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Add Account</DialogTitle>
                                    </DialogHeader>
                                    <div className="w-full p-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
                                        <Sidebar_Card
                                            onClickFunction={() =>
                                                connectTwitter(workspaceId, router, token)
                                            }
                                            imageUrl={"/twitter.png"}
                                            text={"Connect X"}
                                        />
                                        <Sidebar_Card
                                            onClickFunction={() =>
                                                connectLinkedin(workspaceId, router, token)
                                            }
                                            imageUrl={"/linkedIn.png"}
                                            text={"Connect LinkedIn"}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>

            {/* Footer Dropdown */}
            {!loading && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="bg-primary rounded-2xl w-full py-8 mt-auto flex items-center justify-center gap-2">
                            <div className="flex flex-1 space-x-2 items-center justify-center ">

                                {singleWorkspace ? (
                                    <>
                                        {singleWorkspace?.icon ? (
                                            <Image
                                                alt="Workspace Icon"
                                                src={singleWorkspace.icon}
                                                width={30}
                                                height={30}
                                                className="object-contain rounded-full"
                                            />
                                        ) : <Layers

                                            className="object-contain  h-8 w-8  "
                                        />}
                                        <span className="text-white text-lg font-semibold">{singleWorkspace.name}</span>
                                    </>
                                ) : (
                                    <span className="text-white font-semibold">Select a Workspace</span>
                                )}
                            </div>
                            <ChevronsUpDown className="h-6 w-6" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-navBg rounded-md mt-2 w-[16rem] text-center">
                        {workspaces.map((ws, i) => (
                            <Link
                                key={i}
                                href={`/workspace/${ws._id}`}
                                className="text-white block border-b border-white/40 py-2"
                            >
                                {ws.name}
                            </Link>
                        ))}
                        <Link href="/workspaces" className="text-white py-3 block">
                            Manage Workspaces
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}

        </div>
    );
};
