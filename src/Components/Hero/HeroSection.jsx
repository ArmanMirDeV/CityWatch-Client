import React from "react";
import { motion } from "framer-motion";
import heroImage from "../../assets/hero-city.png";
import { Link } from "react-router";

const HeroSection = () => {
  return (
    <section className="relative bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-16 flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Text Content */}
        <div className="flex-1">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            CityWatch - Public Infrastructure Issue Reporting System
          </motion.h1>

          <motion.p
            className="text-gray-700 mb-6 text-lg md:text-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            A digital platform enabling citizens to report real-world public
            issues like broken streetlights, potholes, water leakage, garbage
            overflow, damaged footpaths, and more.
          </motion.p>

          <motion.ul
            className="text-gray-700 mb-8 space-y-2 list-disc list-inside text-lg md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <li>Improves transparency in municipal services</li>
            <li>Reduces response time for reported issues</li>
            <li>Collects and analyzes infrastructure data</li>
            <li>Makes city service delivery more efficient</li>
          </motion.ul>

          
        </div>

        {/* Hero Image */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={heroImage}
            alt="City Infrastructure"
            className="rounded-xl shadow-xl w-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
