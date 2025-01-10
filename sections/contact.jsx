import ContactForm from "@/components/global/contact-form";
import React from "react";

const Contact = () => {
  return (
    <div className="py-24 bg-[#F9FAFF]">
      <h1 className="text-[#0C1E5B] text-4xl font-bold text-center">
        Contact Us
      </h1>
      <ContactForm />
    </div>
  );
};

export default Contact;
