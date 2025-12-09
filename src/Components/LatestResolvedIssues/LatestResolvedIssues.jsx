import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaMapMarkerAlt, FaCheckCircle, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { BASE_URL } from "../../Utils/constants";
import axios from "axios";

const LatestResolvedIssues = () => {
  
  const { data: issuesData = {} } = useQuery({
    queryKey: ["latest-resolved"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/issues?status=resolved&limit=6`);
      return res.data;
    },
  });

  const issues = issuesData.issues || [];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Latest <span className="text-indigo-600">Resolved</span> Issues
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how we are making our city better, one fix at a time.
          </p>
        </div>

        {issues.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No resolved issues yet. Be the first to witness change!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {issues.map((issue, index) => (
              <motion.div
                key={issue._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      issue.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={issue.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                    <FaCheckCircle /> Resolved
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col">
                  <h3
                    className="text-xl font-bold text-gray-800 mb-2 line-clamp-1"
                    title={issue.title}
                  >
                    {issue.title}
                  </h3>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaMapMarkerAlt className="mr-1 text-indigo-500" />
                    <span className="line-clamp-1">{issue.location}</span>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-2 flex-grow">
                    {issue.description}
                  </p>

                  <Link
                    to={`/issue-details/${issue._id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition border border-gray-200 group"
                  >
                    View Details{" "}
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestResolvedIssues;
