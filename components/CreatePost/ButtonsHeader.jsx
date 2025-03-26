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

        <DialogContent className="w-[60vw] max-w-[60vw] h-[720px] p-0 bg-navBg flex border-transparent gap-2 items-start">
          <DialogTitle></DialogTitle>
          <div className="flex relative flex-row gap-3 h-full w-full">
            <DialogSidebar
              workspaceData={workspaceData}
              isSubmitting={form.formState.isSubmitting}
              onSubmit={form.handleSubmit(onSubmit)}
            />
            <div className="flex flex-col gap-4 items-start justify-start h-full w-full pt-20 p-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col w-full  justify-center items-center 
                   "
                >
                  <FormField
                    control={form.control}
                    name="scheduledDateTime"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
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
      </Dialog>

      <CustomButtonHeader
        buttonColor={"#1E58E8"}
        buttonText={"Publish"}
        activeButtons={activeButtons}
        actionButton={() => onPublish()} // Immediate publish
        isDisabled={activeButtons}
      />
    </div>
  );
};
