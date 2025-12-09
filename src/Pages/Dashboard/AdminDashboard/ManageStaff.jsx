import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { FaTrash, FaUserTie, FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

// Recreate config for secondary app
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const ManageStaff = () => {
  const axiosSecure = useAxiosSecure();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Forms
  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    reset: resetAdd,
    formState: { errors: errorsAdd },
  } = useForm();
  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    setValue: setValueUpdate,
    formState: { errors: errorsUpdate },
  } = useForm();

  const { data: staff = [], refetch } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await axiosSecure.get("/staff");
      return res.data;
    },
  });

  const onAddSubmit = async (data) => {
    let secondaryApp = null;
    try {
      // 1. Create User in Firebase Auth (Secondary App)
      secondaryApp = initializeApp(firebaseConfig, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, {
        displayName: data.name,
        photoURL: data.photoURL,
      });
      await signOut(secondaryAuth); // Ensure no session leak

      // 2. Create User in Database
      const staffData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "staff",
        photoURL: data.photoURL,

        password: data.password,
      };

      const res = await axiosSecure.post("/staff", staffData);
      if (res.data.insertedId) {
        resetAdd();
        setIsAddModalOpen(false);
        refetch();
        Swal.fire("Success!", "Staff member added successfully.", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", error.message || "Failed to add staff.", "error");
    } finally {
      if (secondaryApp) deleteApp(secondaryApp);
    }
  };

  const openUpdateModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setValueUpdate("name", staffMember.name);
    setValueUpdate("email", staffMember.email);
    setValueUpdate("phone", staffMember.phone);
    setValueUpdate("photoURL", staffMember.photoURL);
    setIsUpdateModalOpen(true);
  };

  const onUpdateSubmit = async (data) => {
    try {
      const res = await axiosSecure.patch(`/staff/${selectedStaff._id}`, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        photoURL: data.photoURL,
      });

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        refetch();
        setIsUpdateModalOpen(false);
        setSelectedStaff(null);
        Swal.fire("Success", "Staff updated successfully", "success");
      } else {
        Swal.fire("Info", "No changes made", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update staff", "error");
    }
  };

  const handleDeleteStaff = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/staff/${id}`);
        if (res.data.deletedCount > 0) {
          refetch();
          Swal.fire("Deleted!", "Staff member has been deleted.", "success");
        }
      }
    });
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Staff</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary text-black gap-2"
        >
          <FaPlus /> Add New Staff
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-xl border border-gray-100">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Staff Info</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member, index) => (
              <tr key={member._id} className="hover:bg-base-50">
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            member.photoURL || "https://via.placeholder.com/150"
                          }
                          alt="Avatar"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/150")
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{member.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">{member.email}</div>
                  <div className="text-xs text-gray-500">{member.phone}</div>
                </td>
                <td>
                  <span className="badge badge-accent text-white">Staff</span>
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => openUpdateModal(member)}
                    className="btn btn-ghost btn-xs text-info tooltip"
                    data-tip="Update Info"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(member._id)}
                    className="btn btn-ghost btn-xs text-error tooltip"
                    data-tip="Delete Staff"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaUserTie /> Add New Staff
            </h3>
            <form
              onSubmit={handleSubmitAdd(onAddSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="form-control">
                <label className="label">Name</label>
                <input
                  type="text"
                  {...registerAdd("name", { required: true })}
                  className="input input-bordered"
                  placeholder="Full Name"
                />
                {errorsAdd.name && (
                  <span className="text-error text-xs">Required</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Phone</label>
                <input
                  type="tel"
                  {...registerAdd("phone", { required: true })}
                  className="input input-bordered"
                  placeholder="Phone Number"
                />
                {errorsAdd.phone && (
                  <span className="text-error text-xs">Required</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Email</label>
                <input
                  type="email"
                  {...registerAdd("email", { required: true })}
                  className="input input-bordered"
                  placeholder="email@example.com"
                />
                {errorsAdd.email && (
                  <span className="text-error text-xs">Required</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Password</label>
                <input
                  type="text"
                  {...registerAdd("password", { required: true, minLength: 6 })}
                  className="input input-bordered"
                  placeholder="Temporary Password"
                />
                {errorsAdd.password && (
                  <span className="text-error text-xs">Min 6 chars</span>
                )}
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">Photo URL</label>
                <input
                  type="url"
                  {...registerAdd("photoURL")}
                  className="input input-bordered"
                  placeholder="https://..."
                />
              </div>

              <div className="modal-action md:col-span-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-black">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Staff Modal */}
      {isUpdateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FaEdit /> Update Staff Info
            </h3>
            <form
              onSubmit={handleSubmitUpdate(onUpdateSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="form-control">
                <label className="label">Name</label>
                <input
                  type="text"
                  {...registerUpdate("name", { required: true })}
                  className="input input-bordered"
                />
                {errorsUpdate.name && (
                  <span className="text-error text-xs">Required</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Phone</label>
                <input
                  type="tel"
                  {...registerUpdate("phone", { required: true })}
                  className="input input-bordered"
                />
                {errorsUpdate.phone && (
                  <span className="text-error text-xs">Required</span>
                )}
              </div>
              <div className="form-control">
                <label className="label">Email (Read Only)</label>
                <input
                  type="email"
                  {...registerUpdate("email")}
                  className="input input-bordered bg-gray-100"
                  readOnly
                />
                <span className="text-xs text-gray-400 mt-1">
                  Email cannot be changed directly
                </span>
              </div>
              <div className="form-control">
                <label className="label">Photo URL</label>
                <input
                  type="url"
                  {...registerUpdate("photoURL")}
                  className="input input-bordered"
                />
              </div>

              <div className="modal-action md:col-span-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-black">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStaff;
