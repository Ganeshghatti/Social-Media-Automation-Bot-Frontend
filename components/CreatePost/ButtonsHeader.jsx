"use client";
import React, { useEffect, useState } from "react";
import CustomButtonHeader from "./CustomButtonHeader";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { DialogSidebar } from "@components/CreatePost/DialogSidebar";
import { DialogCards } from "@components/CreatePost/DialogCards";
import { Form, FormControl, FormField, FormItem } from "@components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "@components/global/DateTimePicker";
import { SidebarTrigger } from "@components/ui/sidebar";
import { toast } from "sonner";
import { connectLinkedin, connectTwitter } from "@functions/social";
import { useRouter } from "next/navigation";
import useAuthToken from "@hooks/useAuthToken";
import { Sidebar_Card } from "@components/single-workspace/Sidebar_Card";

export const ButtonsHeader = ({
  isEditingDraft,
  onPublish,
  activeButtons,
  createDraftPosts,
  EditDraftPosts,
  singleWorkspace,
  cards,
  setCards,
  textAreaRefs,
  setNewCardAdded,
}) => {
  const [workspaceData, setWorkspaceData] = useState(singleWorkspace);
  const [localCards, setLocalCards] = useState(cards || [{ id: 0, text: "" }]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const token = useAuthToken();

  const formSchema = z.object({
    scheduledDateTime: z.date({
      required_error: "Please select a date and time",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledDateTime: null,
    },
  });

  useEffect(() => {
    if (cards) {
      setLocalCards(cards);
    }
  }, [cards]);

  const handleTextareaChange = (id, val) => {
    setLocalCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, text: val } : card))
    );
    if (setCards) {
      setCards((prev) =>
        prev.map((card) => (card.id === id ? { ...card, text: val } : card))
      );
    }
  };

  useEffect(() => {
    setWorkspaceData(singleWorkspace);
  }, [singleWorkspace]);

  const onSubmit = (values) => {
    try {
      const scheduledDateTime = values.scheduledDateTime;
      console.log("Scheduled DateTime:", scheduledDateTime);
      console.log("Cards:", localCards);

      // Sync localCards back to parent state before publishing
      if (setCards) {
        setCards(localCards);
      }

      // Call onPublish with the scheduled date
      onPublish(scheduledDateTime);

      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Submission Failed");
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-center md:justify-end">
      <CustomButtonHeader
        buttonColor={"#FF9900"}
        activeButtons={activeButtons}
        actionButton={isEditingDraft ? EditDraftPosts : createDraftPosts}
        buttonText={isEditingDraft ? "Edit the Draft" : "Save as Draft"}
        isDisabled={activeButtons}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={!activeButtons}
            style={{ backgroundColor: activeButtons ? "#079500" : "gray" }}
            className="px-6 rounded-full py-3 flex justify-center items-center"
          >
            <span className="text-sm md:text-base font-medium text-white">
              Schedule
            </span>
          </Button>
        </DialogTrigger>
        {workspaceData?.connectedAccounts?.length > 0 ? (
          <DialogContent
            className="w-[90%] md:w-[60vw] md:max-w-[60vw] h-[720px] 
        p-0 bg-navBg flex border-transparent gap-2 items-start"
          >
            <DialogTitle></DialogTitle>

            <div className="flex flex-col-reverse lg:flex-row relative gap-3 h-full w-full">
              <div className=" w-full lg:w-auto">
                <DialogSidebar
                  workspaceData={workspaceData}
                  isSubmitting={form.formState.isSubmitting}
                  onSubmit={form.handleSubmit(onSubmit)}
                />
              </div>

              <div className="flex flex-col gap-4 items-start justify-start h-full w-full pt-20 p-2 order-1 md:order-2">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col w-full justify-center items-center"
                  >
                    <FormField
                      control={form.control}
                      name="scheduledDateTime"
                      render={({ field }) => (
                        <FormItem className="w-[70%] lg:w-2/3">
                          <FormControl>
                            <DateTimePicker
                              date={field.value}
                              setDate={(date) => {
                                console.log("Form Field Updated:", date);
                                field.onChange(date);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
                <DialogCards
                  handleTextareaChange={handleTextareaChange}
                  localCards={localCards}
                  setLocalCards={setLocalCards}
                  setNewCardAdded={setNewCardAdded}
                  textAreaRefs={textAreaRefs}
                />
              </div>
            </div>
          </DialogContent>
        ) : (
          <DialogContent
            className="w-[90%] md:w-[60vw] md:max-w-[60vw] h-1/2 py-12 
         bg-headerBg  space-y-6 border-transparent gap-2 flex flex-col items-center justify-center"
          >
            <DialogTitle className="text-3xl text-white">
              No Accounts To Connect
            </DialogTitle>

            <div className="w-[60%] p-4 grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
              <Sidebar_Card
                onClickFunction={() =>
                  connectTwitter(workspaceData?._id, router, token)
                }
                imageUrl={"/twitter.png"}
                text={"Connect X"}
              />
              <Sidebar_Card
                onClickFunction={() =>
                  connectLinkedin(workspaceData?._id, router, token)
                }
                imageUrl={"/linkedIn.png"}
                text={"Connect LinkedIn"}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>

      <CustomButtonHeader
        buttonColor={"#1E58E8"}
        buttonText={"Publish"}
        activeButtons={activeButtons}
        actionButton={
          singleWorkspace?.connectedAccounts?.length > 0
            ? () => onPublish()
            : () => {
                setIsDialogOpen(true);
              }
        } // Immediate publish
        isDisabled={activeButtons}
      />
    </div>
  );
};
