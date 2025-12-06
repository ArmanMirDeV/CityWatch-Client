// src/components/Features.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaClock, FaChartBar, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt size={30} className="text-white" />,
    title: "Transparency",
    description:
      "Improves transparency by allowing citizens to see the status of all reported issues.",
    bgColor: "bg-blue-600",
  },
  {
    icon: <FaClock size={30} className="text-white" />,
    title: "Reduced Response Time",
    description:
      "Reduces the response time for municipal services by tracking each issue efficiently.",
    bgColor: "bg-green-600",
  },
  {
    icon: <FaChartBar size={30} className="text-white" />,
    title: "Data Analytics",
    description:
      "Collects and analyzes infrastructure data to help authorities make informed decisions.",
    bgColor: "bg-yellow-500",
  },
  {
    icon: <FaUsers size={30} className="text-white" />,
    title: "Community Engagement",
    description:
      "Engages citizens in improving their city by allowing them to report and track issues.",
    bgColor: "bg-purple-600",
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${feature.bgColor}`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
