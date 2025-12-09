import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaLock, FaUserAstronaut } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router";
import useaxiosSecure from "../../../Hooks/useaxiosSecure";
import { useMutation } from "@tanstack/react-query";

export default function LogInPage() {
  const { register, handleSubmit } = useForm();
  const { signInUser, signInGoogle, dbLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axiosSecure = useaxiosSecure();

  const { mutateAsync: saveUser } = useMutation({
    mutationFn: async (user) => {
      const res = await axiosSecure.post("/users", user);
      return res.data;
    },
  });

  // Email/Password Login
  const onSubmit = async (data) => {
    setLoading(true);

    // Password validation: min 6 chars
    if (data.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password must be at least 6 characters long.",
      });
      setLoading(false);
      return;
    }

    try {
      // 1. Firebase Login (Citizens, Admin, Staff)
      const result = await signInUser(data.username, data.password);

      const userInfo = {
        name: result.user.displayName || data.username,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };
      // Ensure user exists in DB (sync) - valuable if they were created manually in Firebase but not in DB (unlikely)
      // or if they are logging in for the first time after a DB wipe?
      // Actually, for Admin/Staff who are ALREADY in DB, this saveUser might trigger "User already exists".
      // Let's see how saveUser handles it.
      await saveUser(userInfo).then((data) => {
        if (data.insertedId) {
          console.log("User added to database");
        }
      });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome ${result.user.displayName || result.user.email}!`,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInGoogle();

      const userInfo = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
      };
      await saveUser(userInfo).then((data) => {
        if (data.insertedId) {
          console.log("User added to database");
        }
      });

      Swal.fire({
        icon: "success",
        title: "Google Sign-In Successful",
        text: `Welcome ${result.user.displayName}!`,
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
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
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username / Email
              </label>
              <div className="flex items-center gap-3 border-b border-gray-300 py-1 focus-within:border-indigo-500">
                <FaUserAstronaut className="text-gray-500" />
                <input
                  {...register("username", { required: true })}
                  placeholder="Enter username or email"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="flex items-center gap-3 border-b border-gray-300 py-1 focus-within:border-indigo-500">
                <FaLock className="text-gray-500" />
                <input
                  type="password"
                  {...register("password", { required: true })}
                  placeholder="Enter password"
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-full shadow-md hover:bg-indigo-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-2 rounded-full shadow-sm hover:bg-gray-50 transition"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-gray-700 text-sm font-medium">
              {loading ? "Processing..." : "Continue with Google"}
            </span>
          </motion.button>

          {/* Register Redirect Button */}
          <motion.div className="mt-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="text-sm text-indigo-600 hover:underline"
            >
              Don't have an account? Register
            </motion.button>
          </motion.div>
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
