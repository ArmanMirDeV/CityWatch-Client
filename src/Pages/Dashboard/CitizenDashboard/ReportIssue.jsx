import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

const image_hosting_key = import.meta.env.VITE_img_host_key;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const ReportIssue = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetch user details to check status
  const { data: dbUser, isLoading: userLoading } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user.email}`);
      return res.data;
    },
  });

  // Fetch stats to check limit
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["citizenStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(`/citizen/stats/${user.email}`);
      return res.data;
    },
  });

  const isLimitReached = !dbUser?.isPremium && stats?.total >= 3;

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      //  Upload image to IMGBB
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const uploadRes = await fetch(image_hosting_api, {
        method: "POST",
        body: formData,
      });

      const imgResult = await uploadRes.json();
      if (!imgResult.success) {
        throw new Error("Image upload failed!");
      }

      const hostedImageURL = imgResult.data.url;

      // 2️⃣ Prepare issue data
      const issueData = {
        ...data,
        image: hostedImageURL,
        userEmail: user.email,
      };
      delete issueData.imageFile;

      // 3️⃣ Send data to backend
      const res = await axiosPublic.post("/issues", issueData);

      if (res.data.insertedId) {
        reset();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Issue Reported Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/dashboard/citizen/my-issues");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || statsLoading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  if (dbUser?.isBlocked) {
    return (
      <div className="alert alert-error shadow-lg my-10 max-w-2xl mx-auto">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Your account is blocked. You cannot report new issues. Please
            contact admin.
          </span>
        </div>
      </div>
    );
  }

  if (isLimitReached) {
    return (
      <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl my-10 border border-warning">
        <div className="card-body text-center">
          <h2 className="card-title justify-center text-2xl text-warning">
            Limit Reached!
          </h2>
          <p>
            You have reached the limit of 3 reported issues for free accounts.
          </p>
          <div className="card-actions justify-center mt-4">
            <Link to="/dashboard/citizen" className="btn btn-primary">
              Go to Stats
            </Link>
            <Link to="/dashboard/citizen/profile" className="btn btn-neutral">
              Upgrade to Premium
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md my-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Report a New Issue
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Issue Title</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Broken Street Light"
            className="input input-bordered w-full"
            {...register("title", { required: true })}
          />
          {errors.title && (
            <span className="text-error text-sm">Title is required</span>
          )}
        </div>

        {/* Category & Location */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered"
              {...register("category", { required: true })}
            >
              <option value="">Select Category</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Garbage">Garbage</option>
              <option value="Others">Others</option>
            </select>
            {errors.category && (
              <span className="text-error text-sm">Category is required</span>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 123 Main St, Dhaka"
              className="input input-bordered w-full"
              {...register("location", { required: true })}
            />
            {errors.location && (
              <span className="text-error text-sm">Location is required</span>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            {...register("image", { required: true })}
          />
          {errors.image && (
            <span className="text-error text-sm">Image is required</span>
          )}
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24"
            placeholder="Describe the issue in detail..."
            {...register("description", { required: true })}
          ></textarea>
          {errors.description && (
            <span className="text-error text-sm">Description is required</span>
          )}
        </div>

        <div className="form-control mt-6">
          <button
            type="submit"
            className={`btn btn-primary text-black w-full ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportIssue;
