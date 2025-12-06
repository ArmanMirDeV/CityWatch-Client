import React from "react";
import { motion } from "framer-motion";
import { FaMedal, FaTrophy, FaUsers, FaFire, FaGift } from "react-icons/fa";

const challenges = [
  {
    title: "Top Reporter of the Month",
    subtitle: "Report the most verified issues",
    icon: <FaMedal className="text-yellow-500" />,
    reward: "Gold Badge + Featured on Leaderboard",
  },
  {
    title: "Community Helper",
    subtitle: "Upvote 20+ issues from other citizens",
    icon: <FaUsers className="text-blue-500" />,
    reward: "Community Helper Badge",
  },
  {
    title: "Rapid Response Hero",
    subtitle: "Report an urgent issue and get it resolved within 24 hours",
    icon: <FaFire className="text-red-500" />,
    reward: "Rapid Response Badge",
  },
  {
    title: "Eco Guardian",
    subtitle: "Report 10+ environmental issues (garbage, leaks, pollution)",
    icon: <FaTrophy className="text-green-500" />,
    reward: "Eco Guardian Badge",
  },
];

const CommunityChallenges = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center text-blue-900"
        >
          Community Challenges
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 max-w-2xl mx-auto mt-4 mb-12"
        >
          Earn badges, climb the leaderboard, and help make your city cleaner,
          safer, and smarter.
        </motion.p>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {challenges.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl cursor-pointer border transition-all"
            >
              <div className="text-5xl flex justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center">
                {item.title}
              </h3>
              <p className="text-gray-600 text-center mt-2">{item.subtitle}</p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-5 flex justify-center text-sm text-center text-blue-700 font-semibold bg-blue-50 py-2 rounded-lg"
              >
                <FaGift size={20} />
                Reward: {item.reward}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Leaderboard CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="px-8 py-3 rounded-full bg-blue-700 text-white text-lg font-semibold hover:bg-blue-800 transition-all shadow-lg">
            View Community Leaderboard
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityChallenges;
