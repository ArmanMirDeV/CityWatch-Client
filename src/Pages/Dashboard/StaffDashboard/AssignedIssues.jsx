import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AssignedIssues = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Fetch Assigned Issues
  const { data: issues = [], refetch } = useQuery({
    queryKey: ["assigned-issues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/staff/${user.email}/issues`);
      return res.data;
    },
  });

  const filteredIssues = issues.filter((issue) => {
    const matchesStatus =
      filterStatus === "all" || issue.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || issue.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  const handleStatusChange = async (issue, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/issues/${issue._id}/status`, {
        newStatus,
        updatedBy: user.email,
        staffEmail: user.email, 
      });

      if (res.data.modifiedCount > 0) {
        refetch();
        Swal.fire("Updated!", `Status changed to ${newStatus}`, "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold my-4">
        My Assigned Tasks: {issues.length}
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-medium">Filter by Status</span>
          </label>
          <select
            className="select select-bordered"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text font-medium">Filter by Priority</span>
          </label>
          <select
            className="select select-bordered"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div
            key={issue._id}
            className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300"
          >
            <figure className="h-48 overflow-hidden relative">
              <img
                src={issue.image || issue.img}
                alt={issue.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <div
                  className={`badge ${
                    issue.priority === "high"
                      ? "badge-error"
                      : issue.priority === "medium"
                      ? "badge-warning"
                      : "badge-info"
                  } badge-sm shadow-md`}
                >
                  {issue.priority}
                </div>
              </div>
            </figure>
            <div className="card-body">
              <h2 className="card-title text-base">{issue.title}</h2>
              <p className="text-xs text-gray-400 absolute top-4 left-4 bg-white/80 px-2 py-0.5 rounded backdrop-blur-sm">
                {issue.category}
              </p>

              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <span className="font-semibold">Loc:</span> {issue.location}
              </p>
              <p className="text-sm line-clamp-2 mt-2 text-gray-600">
                {issue.description}
              </p>

              <div className="divider my-2"></div>

              <div className="card-actions justify-between items-center">
                <span
                  className={`badge ${
                    issue.status === "pending"
                      ? "badge-warning"
                      : issue.status === "in-progress"
                      ? "badge-info"
                      : "badge-success"
                  } p-3`}
                >
                  {issue.status}
                </span>

                <div className="dropdown dropdown-end dropdown-top">
                  <label
                    tabIndex={0}
                    className="btn btn-sm btn-primary text-black"
                  >
                    Update Status
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-gray-100"
                  >
                    <li>
                      <a
                        onClick={() => handleStatusChange(issue, "in-progress")}
                      >
                        In Progress
                      </a>
                    </li>
                    <li>
                      <a onClick={() => handleStatusChange(issue, "resolved")}>
                        Resolved
                      </a>
                    </li>
                    <li>
                      <a onClick={() => handleStatusChange(issue, "closed")}>
                        Closed
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filteredIssues.length === 0 && (
        <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
          <p className="text-lg">No issues found matching your filters.</p>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
