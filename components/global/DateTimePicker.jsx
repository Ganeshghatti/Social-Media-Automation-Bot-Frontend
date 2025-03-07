"use client";
import * as React from "react";
import { format } from "date-fns";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";

export const DateTimePicker = ({ date, setDate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (date) {
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
      } else {
        newDate.setHours(0, 0, 0, 0); // Default to midnight if no time set
      }
      console.log("Selected Date:", newDate); // Debug log
      setDate(newDate);
    }
  };

  const handleTimeChange = (type, value) => {
    const newDate = date ? new Date(date) : new Date();
    if (type === "hour") {
      const currentHour = newDate.getHours();
      const isPM = currentHour >= 12;
      newDate.setHours((parseInt(value) % 12) + (isPM ? 12 : 0));
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
    console.log("Updated Time:", newDate); // Debug log
    setDate(newDate);
  };

  // Prevent popover from closing when clicking inside
  const handleContentClick = (e) => {
    console.log("Hii ")
    e.stopPropagation();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          onClick={() => setIsOpen(true)} // Ensure clicking opens the popover
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>Select date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
       
        onClick={handleContentClick} // Prevent closing on internal clicks
      >
        <div
          className="sm:flex z-30"
          onMouseEnter={() => {
            console.log("hii");
          }}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && (date.getHours() % 12 || 12) === hour
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange(
                        "minute",
                        minute.toString().padStart(2, "0")
                      )
                    }
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>

            <ScrollArea>
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      (ampm === "AM"
                        ? date.getHours() < 12
                        : date.getHours() >= 12)
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
