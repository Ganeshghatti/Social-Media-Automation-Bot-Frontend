"use client";
import * as React from "react";
import { format } from "date-fns";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";

export const DateTimePicker = ({ date, setDate }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState(date || null);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (tempDate) {
        newDate.setHours(tempDate.getHours(), tempDate.getMinutes(), 0, 0);
      } else {
        newDate.setHours(0, 0, 0, 0);
      }
      console.log("Selected Date:", newDate);
      setTempDate(newDate);
    }
  };

  const handleTimeChange = (type, value) => {
    const newDate = tempDate ? new Date(tempDate) : new Date();
    if (type === "hour") {
      const hour = parseInt(value);
      const currentHour = newDate.getHours();
      const isPM = currentHour >= 12;
      // Handle 12 explicitly: 12 AM = 0, 12 PM = 12
      if (hour === 12) {
        newDate.setHours(isPM ? 12 : 0);
      } else {
        newDate.setHours((hour % 12) + (isPM ? 12 : 0));
      }
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value));
    } else if (type === "ampm") {
      const currentHours = newDate.getHours();
      if (value === "PM" && currentHours < 12) {
        newDate.setHours(currentHours + 12);
      } else if (value === "AM" && currentHours >= 12) {
        newDate.setHours(currentHours - 12);
      }
    }
    console.log("Updated Time:", newDate);
    setTempDate(newDate);
  };

  const handleApply = () => {
    console.log("Applying DateTime:", tempDate);
    setDate(tempDate);
    setIsOpen(false);
  };

  const handleClose = () => {
    console.log("Closing without applying");
    setTempDate(date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
        onClick={() => {
          console.log("Trigger Clicked - Opening Picker");
          setIsOpen(true);
        }}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "MM/dd/yyyy hh:mm aa") : <span>Select date and time</span>}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleClose}
        >
          <div
            className="bg-navBg text-white rounded-lg shadow-lg flex flex-col p-4 
        max-h-[90vh] overflow-y-auto justify-between space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row justify-between max-h-[80vh]">
              <Calendar
                mode="single"
                selected={tempDate}
                onSelect={(day) => {
                  console.log("Calendar Day Selected:", day);
                  handleDateSelect(day);
                }}
                initialFocus
                className="mb-4 flex-1"
              />
              <div className="flex flex-1 gap-4 h-[28vh] maxh-[28vh] no-scrollbar justify-around">
                <ScrollArea className="no-scrollbar h-full">
                  <div className="flex flex-col no-scrollbar">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <Button
                        key={hour}
                        variant={
                          tempDate && (tempDate.getHours() % 12 || 12) === hour
                            ? "default"
                            : "ghost"
                        }
                        className="w-full h-10"
                        onClick={() => {
                          console.log("Hour Clicked:", hour);
                          handleTimeChange("hour", hour.toString());
                        }}
                      >
                        {hour}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
                <ScrollArea className="h-full no-scrollbar">
                  <div className="flex flex-col">
                    {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                      <Button
                        key={minute}
                        variant={
                          tempDate && tempDate.getMinutes() === minute ? "default" : "ghost"
                        }
                        className="w-full h-10"
                        onClick={() => {
                          console.log("Minute Clicked:", minute);
                          handleTimeChange("minute", minute.toString().padStart(2, "0"));
                        }}
                      >
                        {minute.toString().padStart(2, "0")}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
                <div className="flex flex-col h-full no-scrollbar gap-2">
                  {["AM", "PM"].map((ampm) => (
                    <Button
                      key={ampm}
                      variant={
                        tempDate &&
                        (ampm === "AM" ? tempDate.getHours() < 12 : tempDate.getHours() >= 12)
                          ? "default"
                          : "ghost"
                      }
                      className="w-16 h-10"
                      onClick={() => {
                        console.log("AM/PM Clicked:", ampm);
                        handleTimeChange("ampm", ampm);
                      }}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-row space-x-3 items-center gap-2 mt-8">
              <Button variant="outline" className=" text-black flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleApply}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};