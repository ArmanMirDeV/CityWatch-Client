import React from "react";
import { motion } from "framer-motion";
import {
  FaRegLightbulb,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const steps = [
  {
    title: "Report an Issue",
    description:
      "Citizens submit a report with photos, location, and description of public issues.",
    icon: <FaRegLightbulb size={30} className="text-white" />,
    bgColor: "bg-blue-600",
  },
  {
    title: "Verification & Assignment",
    description:
      "Admins review reports and assign the issue to the appropriate staff for resolution.",
    icon: <FaUsers size={30} className="text-white" />,
    bgColor: "bg-green-600",
  },
  {
    title: "Track Progress",
    description:
      "Staff update the issue status, and citizens can track the progress in real-time.",
    icon: <FaMapMarkerAlt size={30} className="text-white" />,
    bgColor: "bg-yellow-500",
  },
  {
    title: "Resolved & Closed",
    description:
      "Once resolved, admins close the issue, and citizens are notified of completion.",
    icon: <FaCheckCircle size={30} className="text-white" />,
    bgColor: "bg-purple-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${step.bgColor}`}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
