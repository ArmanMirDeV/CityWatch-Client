import React, { useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";

import Swal from "sweetalert2";
import { AuthContext } from "../../../Authentication/Context/AuthContext";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const StaffProfile = () => {
  const { user, logOut } = useAuth();
  const { dbLogin } = useContext(AuthContext); 
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();



  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch staff data using React Query
  const { data: staffData, isLoading, refetch } = useQuery({
    queryKey: ['staffProfile', user?.email],
    enabled: !!user?.email, 
    queryFn: async () => {
       const res = await axiosSecure.get(`/staff/email/${user.email}`); 
       return res.data;
    },
    onSuccess: (data) => {
        if(data) {
          setValue("name", data.name);
          setValue("email", data.email);
          setValue("password", data.password);
          setValue("photoURL", data.photoURL);
        }
    }
  });

  useEffect(() => {
      if (staffData) {
          setValue("name", staffData.name);
          setValue("email", staffData.email);
          setValue("password", staffData.password);
          setValue("photoURL", staffData.photoURL);
      } else if (user && !staffData && !isLoading) {
           // Fallback if not loaded from DB yet/error
           setValue("name", user.displayName || user.name);
           setValue("email", user.email);
      }
  }, [staffData, user, setValue, isLoading]);

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.patch(`/staff/${staffData._id}`, {
        name: data.name,
        email: data.email,
        password: data.password,
        photoURL: data.photoURL,
      });

      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire({
          title: "Success",
          text: "Profile updated. Please login again if you changed your email.",
          icon: "success",
        }).then(async () => {
          if (data.email !== user.email) {
            await logOut();
            navigate("/login");
          } else {
            const updatedUser = {
              ...user,
              name: data.name,
              email: data.email,
              photoURL: data.photoURL,
            };
            dbLogin(updatedUser);
          }
        });
      } else {
        Swal.fire("Info", "No changes made or email already exists.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  return (
    <div className="w-full p-4 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Info Card */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100">
            <div className="avatar mb-4">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    staffData?.photoURL ||
                    user?.photoURL ||
                    "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                  }
                  alt="Profile"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {staffData?.name || user?.displayName}
            </h2>
            <p className="text-sm text-gray-500 mb-2">{staffData?.email || user?.email}</p>
            <div className="badge badge-primary badge-outline mt-2 uppercase font-bold text-xs">
              Staff Member
            </div>
            
            <div className="divider my-4"></div>
            
            <div className="w-full text-left space-y-2">
                 <p className="text-xs text-black uppercase tracking-wide">User ID</p>
                 <p className="text-xs text-black font-mono  p-2 rounded truncate" title={user?._id}>
                    {user?._id}
                 </p>
            </div>
          </div>
        </div>

        {/* Update Form */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
              Update Profile
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className="input input-bordered w-full focus:input-primary"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                  <span className="label-text-alt text-warning">Contact admin to change</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  disabled
                  className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Photo URL</span>
                  </label>
                  <input
                    type="url"
                    {...register("photoURL")}
                    className="input input-bordered w-full focus:input-primary"
                    placeholder="https://..."
                  />
                </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">New Password</span>
                </label>
                <input
                  type="text"
                  {...register("password", { minLength: 6 })}
                  className="input input-bordered w-full focus:input-primary"
                  placeholder="Enter new password to change"
                />
              </div>

              <div className="form-control mt-8">
                <button className="btn btn-primary w-full text-black font-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
