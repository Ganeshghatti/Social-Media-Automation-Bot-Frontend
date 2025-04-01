"use client";
import React, { useState } from "react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formSchema = z.object({
    scheduledDateTime: z.date({ required_error: "Please select a date and time" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { scheduledDateTime: null },
  });

  const onSubmit = (values) => {
    try {
      const scheduledDateTime = values.scheduledDateTime;
      onPublish(scheduledDateTime);
      setIsDialogOpen(false);
    } catch (error) {
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
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            style={{ backgroundColor: activeButtons ? "#079500" : "gray" }}
            className="px-6 rounded-full py-3 flex justify-center items-center"
          >
            <span className="text-sm md:text-base font-medium text-white">Schedule</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vw] max-w-[900px] h-[80vh] max-h-[720px] p-4 bg-navBg flex border-transparent gap-4 rounded-lg shadow-lg">
          <DialogTitle className="sr-only">Schedule Post</DialogTitle>
          <div className="flex flex-row gap-4 h-full w-full overflow-hidden">
            <DialogSidebar
              workspaceData={singleWorkspace}
              isSubmitting={form.formState.isSubmitting}
              onSubmit={form.handleSubmit(onSubmit)}
            />
            <div className="flex flex-col gap-6 items-center justify-start h-full w-full px-4 pt-6 pb-4 ">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col items-center gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledDateTime"
                    render={({ field }) => (
                      <FormItem className="w-3/4 max-w-[400px]">
                        <FormControl>
                          <DateTimePicker date={field.value} setDate={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <DialogCards
                localCards={cards}
                setLocalCards={setCards}
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
        actionButton={() => onPublish()}
      />
    </div>
  );
};