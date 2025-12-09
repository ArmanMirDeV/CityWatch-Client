import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import { BASE_URL } from "../../Utils/constants";
import Timeline from "../../Components/Timeline";
import PaymentModal from "../../Components/PaymentModal";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaTrash,
  FaEdit,
  FaRocket,
  FaUserTie,
  FaThumbsUp,
} from "react-icons/fa";
import EditIssueModal from "../Dashboard/CitizenDashboard/EditIssueModal";

const IssueDetails = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const {
    data: issue,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/issues/${id}`);
      return res.data;
    },
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/issues/${id}`);
          if (res.data.deletedCount > 0) {
            Swal.fire("Deleted!", "Your issue has been deleted.", "success");
            navigate("/dashboard/citizen");
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  if (!issue)
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        Issue not found.
      </div>
    );

  const {
    title,
    description,
    category,
    status,
    priority,
    location,
    img,
    image,
    createdAt,
    userEmail,
    assignedStaff,
    staffDetails,
    timeline,
    upvotes,
  } = issue;
  const isOwner = user?.email === userEmail;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex gap-2 mb-2">
            <span
              className={`badge ${
                status === "resolved"
                  ? "badge-success"
                  : status === "pending"
                  ? "badge-warning"
                  : "badge-neutral"
              } uppercase font-bold text-white`}
            >
              {status}
            </span>
            <span
              className={`badge ${
                priority === "high" ? "badge-error" : "badge-info"
              } uppercase font-bold text-white`}
            >
              {priority} Priority
            </span>
            <span className="badge badge-ghost uppercase font-semibold">
              {category}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            {title}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-gray-500">
            <p className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-primary" /> {location}
            </p>
            <p className="flex items-center gap-1">
              <FaCalendarAlt /> {new Date(createdAt).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-1">
              <FaThumbsUp className="text-blue-500" /> {upvotes?.length || 0}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isOwner && status === "pending" && (
            <button
              className="btn btn-outline btn-info gap-2"
              onClick={() => {
                setSelectedIssue(issue);
                setIsEditModalOpen(true);
              }}
            >
              <FaEdit /> Edit
            </button>
          )}
          {isOwner && (
            <button
              className="btn btn-outline btn-error gap-2"
              onClick={handleDelete}
            >
              <FaTrash /> Delete
            </button>
          )}
          {priority !== "high" && (
            <button
              className="btn btn-primary text-black gap-2 animate-pulse"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <FaRocket /> Boost Issue
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-xl border border-base-200">
            <img
              src={img || image}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="bg-base-100 p-6 rounded-xl shadow-lg border border-base-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {description}
            </p>
          </div>

          {/* Timeline Component */}
          <Timeline timeline={timeline} />
        </div>

        {/* Right Column: Staff & User Info */}
        <div className="space-y-6">
          {/* Reporter Info */}
          <div className="bg-base-100 p-6 rounded-xl shadow-md border border-base-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
              <FaUser className="text-primary" /> Reported By
            </h3>
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-12">
                  <span className="text-xl">
                    <img
                      src={
                        user.photoURL ||
                        "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"
                      }
                      alt="User"
                    />
                  </span>
                </div>
              </div>
              <div>
                <p className="font-semibold">{userEmail}</p>
                <p className="text-xs text-gray-500">Citizen</p>
              </div>
            </div>
          </div>

          {/* Assigned Staff Info */}
          <div className="bg-base-100 p-6 rounded-xl shadow-md border border-base-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
              <FaUserTie className="text-secondary" /> Assigned Staff
            </h3>
            {assignedStaff ? (
              <div className="flex items-center gap-3">
                {staffDetails?.image ? (
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img src={staffDetails.image} alt="Staff" />
                    </div>
                  </div>
                ) : (
                  <div className="avatar placeholder">
                    <div className="bg-secondary text-secondary-content rounded-full w-12">
                      <span className="text-xl">
                        {assignedStaff.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="font-semibold">
                    {staffDetails?.name || assignedStaff}
                  </p>
                  <p className="text-sm text-gray-500">
                    {staffDetails?.role || "Staff Member"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaEnvelope /> {assignedStaff}
                  </p>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning text-sm">
                <span>No staff assigned yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditIssueModal
          issue={selectedIssue}
          onClose={() => setIsEditModalOpen(false)}
          refetch={refetch}
        />
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        issueId={id}
        userEmail={user?.email}
        refetch={refetch}
      />
    </div>
  );
};

export default IssueDetails;
