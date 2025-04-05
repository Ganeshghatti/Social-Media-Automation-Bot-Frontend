'use client'
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is Squirrel Pilot?',
      answer:
        'Squirrel Pilot is an AI-powered social media management platform that helps you automate content creation, scheduling, and analytics for platforms like LinkedIn and Twitter.',
    },
    {
      question: 'How does the AI content generator work?',
      answer:
        'Our AI analyzes your brand voice and audience preferences to generate tailored posts and captions. Simply input your topic or keywords, and let the AI do the rest.',
    },
    {
      question: 'Which platforms are supported?',
      answer:
        'Currently, Squirrel Pilot supports LinkedIn and Twitter (X). We’re working on adding more platforms based on user feedback!',
    },
    {
      question: 'Can I try Squirrel Pilot for free?',
      answer:
        'Yes! We offer a 14-day free trial so you can explore all features with no commitment. Sign up today to get started.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. We use industry-standard encryption and OAuth authentication to ensure your accounts and data are safe and secure.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
              <span className="uppercase text-[#f08c4a] text-sm font-bold tracking-wider font-sora">
                Frequently Asked Questions
              </span>
              <div className="h-1 w-6 bg-[#f08c4a]"></div>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white font-sora">
            Got Questions? We’ve Got Answers
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 font-dm-sans">
            Everything you need to know about Squirrel Pilot and how it can transform your social media strategy.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-md mb-4 overflow-hidden border border-gray-100 dark:border-neutral-700"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-sora">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="h-6 w-6 text-[#e05a00]" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-[#e05a00]" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 dark:text-gray-300 font-dm-sans">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4 font-dm-sans">
            Still have questions? We’re here to help!
          </p>
          <a
            href="#cta"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#e05a00] hover:bg-[#f08c4a] rounded-full text-white font-medium transition-colors duration-300 shadow-lg hover:shadow-xl font-sora"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faq;