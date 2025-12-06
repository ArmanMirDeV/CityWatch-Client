import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

const faqs = [
  {
    question: "How do I report an issue?",
    answer:
      "You can report an issue by clicking the 'Report Issue' button in your dashboard and filling out the required details including title, category, description, and optionally upload a photo.",
  },
  {
    question: "Can I track my reported issues?",
    answer:
      "Yes! Once you submit an issue, it will appear in your 'My Issues' section where you can track its status from Pending → In-Progress → Resolved → Closed.",
  },
  {
    question: "What are the benefits of premium subscription?",
    answer:
      "Premium users can report unlimited issues, boost priority issues for faster resolution, and enjoy priority support.",
  },
  {
    question: "Who can resolve the reported issues?",
    answer:
      "Issues are assigned to staff members by admins, who then verify and update the status until it’s resolved and closed.",
  },
  {
    question: "Can I upvote someone else's issue?",
    answer:
      "Yes! You can upvote any issue reported by others to show public importance, but you cannot upvote your own issues.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
            >
              <div
                className="flex justify-between items-center px-6 py-4"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {faq.question}
                </h3>
                <span className="text-blue-600 text-2xl">
                  {openIndex === index ? <FiMinus /> : <FiPlus />}
                </span>
              </div>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
