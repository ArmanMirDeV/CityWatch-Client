import React from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaAward, FaStar } from "react-icons/fa";

const awards = [
  {
    icon: <FaTrophy className="text-yellow-500" />,
    title: "Best Civic Innovation 2024",
    description:
      "Recognized for modernizing public issue reporting and improving city services.",
  },
  {
    icon: <FaMedal className="text-blue-500" />,
    title: "Smart City Excellence Award",
    description:
      "Awarded for contributing significantly to smart-city transformation.",
  },
  {
    icon: <FaAward className="text-purple-500" />,
    title: "GovTech Innovation Award",
    description:
      "Honored for efficient issue resolution workflows for government staff.",
  },
  {
    icon: <FaStar className="text-orange-500" />,
    title: "Top User Satisfaction Platform",
    description:
      "Rated 4.9/5 by thousands of citizens for transparency and reliability.",
  },
];

const Awards = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 mb-12"
        >
          Recognitions & Awards
        </motion.h2>

        {/* Award Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-white text-center rounded-2xl shadow-lg border hover:shadow-2xl transition-all duration-300"
            >
              <div className="text-5xl mb-4 flex justify-center">
                {award.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {award.title}
              </h3>

              <p className="text-gray-600 text-sm">{award.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
