import { Textarea } from "@components/ui/textarea";
import React, { useRef, useEffect, forwardRef } from "react";

export const CustomTextarea = forwardRef(({ value, onChange }, ref) => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollHeight
    }
  };

  useEffect(() => {
    adjustHeight(); // Adjust height on value change
  }, [value]);

  return (
    <Textarea
      ref={ref || textareaRef} // Use external ref if provided
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        adjustHeight(); // Adjust height on every change
      }}
      className="w-full bg-transparent  border-0 focus:outline-none p-2 rounded-md text-white resize-none overflow-hidden"
      style={{ minHeight: "120px" }}
    />
  );
});
