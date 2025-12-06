import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

export default function RegistrationForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d8dae7] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl"
      >
        {/* LEFT SIDE — FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">
            <span className="font-bold">Registration</span> Form
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Second Name
                </label>
                <input
                  {...register("secondName")}
                  className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                {...register("username")}
                className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              <input
                {...register("phone")}
                className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-full shadow-md hover:bg-indigo-700 transition"
            >
              Register
            </motion.button>
          </form>
        </div>

        {/* RIGHT SIDE — ROCKET ART */}
        <div className="w-full md:w-1/2 bg-[#1e2130] flex items-center justify-center relative p-10">
          {/* geometric shapes */}
          <Shapes />

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative flex flex-col items-center"
          >
            <FaRocket className="text-white text-[120px]" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-4 h-20 bg-gradient-to-b from-red-400 to-transparent rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* LITTLE CONFETTI SHAPES */
function Shapes() {
  const shapes = Array.from({ length: 12 });

  return (
    <>
      {shapes.map((_, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 border-2
          ${
            i % 3 === 0
              ? "border-pink-400"
              : i % 3 === 1
              ? "border-indigo-300"
              : "border-green-300"
          }
          transform rotate-${
            i % 4 === 0 ? "12" : i % 4 === 1 ? "45" : i % 4 === 2 ? "90" : "180"
          }
          `}
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
          }}
        ></div>
      ))}
    </>
  );
}
