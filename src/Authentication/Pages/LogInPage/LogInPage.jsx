import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaLock, FaUserAstronaut } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LogInPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Login Data:", data);
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign-In Clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d8dae7] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl"
      >
        {/* LEFT — LOGIN FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <div className="flex items-center gap-3 border-b border-gray-300 py-1 focus-within:border-indigo-500">
                <FaUserAstronaut className="text-gray-500" />
                <input
                  {...register("username")}
                  placeholder="Enter username"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="flex items-center gap-3 border-b border-gray-300 py-1 focus-within:border-indigo-500">
                <FaLock className="text-gray-500" />
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Enter password"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-full shadow-md hover:bg-indigo-700 transition"
            >
              Login
            </motion.button>
          </form>

          {/* Google Sign In */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleSignIn}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-2 rounded-full shadow-sm hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-gray-700 text-sm font-medium">
              Continue with Google
            </span>
          </motion.button>

          {/* Forgot password */}
          <div className="text-right mt-4">
            <button className="text-sm text-indigo-600 hover:underline">
              Forgot Password?
            </button>
          </div>
        </div>

        {/* RIGHT — ILLUSTRATION */}
        <div className="w-full md:w-1/2 bg-[#1e2130] flex items-center justify-center relative p-10 overflow-hidden">
          <Stars />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <FaUserAstronaut className="text-white text-[120px]" />
            <p className="text-gray-300 mt-4 text-lg tracking-wide">
              Welcome Back, Explorer
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* BACKGROUND FLOATING STAR SHAPES */
function Stars() {
  const stars = Array.from({ length: 14 });

  return (
    <>
      {stars.map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-indigo-300 rounded-full opacity-70"
          style={{
            top: `${Math.random() * 95}%`,
            left: `${Math.random() * 95}%`,
          }}
        ></div>
      ))}
    </>
  );
}
