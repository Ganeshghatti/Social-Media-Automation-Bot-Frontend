import React, { useRef, useEffect, forwardRef } from "react";

export const CustomTextarea = forwardRef(({ value, onChange }, ref) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        420
      )}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref || textareaRef} // Allow external ref or fallback
      rows={2}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border-0 focus:outline-none resize-none overflow-auto max-h-[240px] p-2 rounded-md text-white"
    />
  );
});
