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
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="w-full px-8 py-3 gap-3 flex justify-end">
      <CustomButtonHeader
        buttonColor={"#FF9900"}
        activeButtons={activeButtons}
        actionButton={isEditingDraft ? EditDraftPosts : createDraftPosts}
        buttonText={isEditingDraft ? "Edit the Draft" : "Save as Draft"}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            style={{ backgroundColor: activeButtons ? "#079500" : "gray" }}
            className="px-6 rounded-full py-3 flex justify-center items-center"
          >
            <span className="text-base font-medium text-white">Schedule</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[60vw] max-w-[60vw] h-[720px] p-0 bg-navBg flex border-transparent gap-2 items-start">
          <DialogTitle></DialogTitle>

          <div className="flex relative flex-row gap-3 h-full w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-row w-full h-full"
              >
                <DialogSidebar
                  workspaceData={workspaceData}
                  isSubmitting={form.formState.isSubmitting}
                />
                <div className="flex flex-col gap-4 py-12 items-center justify-center w-full flex-1">
                  <FormField
                    control={form.control}
                    name="scheduledDateTime"
                    render={({ field }) => (
                      <FormItem className="w-64">
                        <FormControl>
                          <DateTimePicker
                            date={field.value}
                            setDate={(date) => {
                              console.log("Data ", date);
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogCards
                    handleTextareaChange={handleTextareaChange}
                    localCards={localCards}
                    setLocalCards={setLocalCards}
                    setNewCardAdded={setNewCardAdded}
                    textAreaRefs={textAreaRefs}
                  />
                  <Button type="submit" className="mt-4">
                    Schedule Post
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <CustomButtonHeader
        buttonColor={"#1E58E8"}
        buttonText={"Publish"}
        activeButtons={activeButtons}
        actionButton={() => onPublish()} // Call without scheduled date for immediate publish
      />
    </div>
  );
};
