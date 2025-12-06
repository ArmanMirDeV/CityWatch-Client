import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";

export default function RegistrationForm() {
  const { register, handleSubmit } = useForm();
  const { registerUser, signInGoogle, updateUserProfile } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Upload profile image to ImgBB
      const imageFile = data.profileImage[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbbRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_img_host_key
        }`,
        formData
      );
      const photoURL = imgbbRes.data.data.url;

      // Create user with email & password
      const userCredential = await registerUser(data.email, data.password);

      // Update Firebase user profile
      await updateUserProfile({
        displayName: `${data.firstName} ${data.secondName}`,
        photoURL,
      });

      // SweetAlert success
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: `Welcome ${data.firstName}!`,
        showConfirmButton: false, // Auto close
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInGoogle();
      Swal.fire({
        icon: "success",
        title: "Google Sign-In Successful",
        text: `Welcome ${result.user.displayName}!`,
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
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
        className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl"
      >
        {/* LEFT SIDE — FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Registration
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  First Name
                </label>
                <input
                  {...register("firstName", { required: true })}
                  className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Second Name
                </label>
                <input
                  {...register("secondName", { required: true })}
                  className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Username
              </label>
              <input
                {...register("username", { required: true })}
                className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                {...register("password", { required: true })}
                type="password"
                className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
              />
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Upload Profile Image
              </label>
              <input
                {...register("profileImage", { required: true })}
                type="file"
                accept="image/*"
                className="w-full border-b border-gray-300 focus:border-indigo-500 outline-none py-1"
              />
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-full shadow-md hover:bg-indigo-700 transition"
            >
              {loading ? "Registering..." : "Register"}
            </motion.button>
          </form>

          {/* Google Sign In Button */}
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
        </div>

        {/* RIGHT SIDE — ROCKET ART */}
        <div className="w-full md:w-1/2 bg-[#1e2130] flex items-center justify-center relative p-10">
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
