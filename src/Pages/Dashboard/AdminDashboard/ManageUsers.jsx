import React from "react";
import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { FaTrash, FaUserShield, FaBan, FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();

  const { data: users = [], refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const handleBlockUser = (user) => {
    Swal.fire({
      title: `Block ${user.name}?`,
      text: "They will not be able to report issues.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, block!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`/users/block/${user.email}`, {
          isBlocked: true,
        });
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire("Blocked!", `${user.name} has been blocked.`, "success");
        }
      }
    });
  };

  const handleUnblockUser = (user) => {
    Swal.fire({
      title: `Unblock ${user.name}?`,
      text: "They will be able to report issues again.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unblock!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`/users/block/${user.email}`, {
          isBlocked: false,
        });
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire(
            "Unblocked!",
            `${user.name} has been unblocked.`,
            "success"
          );
        }
      }
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold my-4">Manage Users: {users.length}</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
        <table className="table w-full">
          <thead className="bg-gray-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role === "admin" ? "Admin" : "Citizen"}</td>
                <td>
                  {user.isPremium ? (
                    <div
                      className="tooltip"
                      data-tip={`Since ${new Date(
                        user.premiumAt
                      ).toLocaleDateString()}`}
                    >
                      <span className="badge badge-accent text-white">
                        Premium
                      </span>
                    </div>
                  ) : (
                    <span className="badge badge-ghost">Free</span>
                  )}
                </td>
                <td>
                  {user.isBlocked ? (
                    <span className="text-red-500 font-bold flex items-center gap-1">
                      <FaBan /> Blocked
                    </span>
                  ) : (
                    <span className="text-green-500 font-bold flex items-center gap-1">
                      <FaCheckCircle /> Active
                    </span>
                  )}
                </td>
                <td>
                  {user.role !== "admin" &&
                    (user.isBlocked ? (
                      <button
                        onClick={() => handleUnblockUser(user)}
                        className="btn btn-sm btn-success text-white"
                        title="Unblock User"
                      >
                        <FaCheckCircle /> Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUser(user)}
                        className="btn btn-sm btn-error text-white"
                        title="Block User"
                      >
                        <FaBan /> Block
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
