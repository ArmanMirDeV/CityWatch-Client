import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useaxiosSecure from "../../Hooks/useaxiosSecure";
import IssueCard from "../../Components/IssueCard";
import { FaSearch, FaFilter } from "react-icons/fa";

const AllIssues = () => {
  const axiosSecure = useaxiosSecure();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      "issues",
      page,
      debouncedSearch,
      filterStatus,
      filterCategory,
      filterPriority,
    ],
    queryFn: async () => {
      const params = {
        page,
        limit,
        search: debouncedSearch,
        ...(filterStatus && { status: filterStatus }),
        ...(filterCategory && { category: filterCategory }),
        ...(filterPriority && { priority: filterPriority }),
      };
      const res = await axiosSecure.get("/issues", { params });
      return res.data;
    },
  });

  const issues = data?.issues || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800 uppercase tracking-wide">
        All Reported Issues
      </h1>

      {/* Search and Filters */}
      <div className="bg-base-200 p-6 rounded-xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by title, location..."
              className="input input-bordered w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-2/3 justify-end">
            <select
              className="select select-bordered w-full md:w-auto"
              onChange={handleFilterChange(setFilterCategory)}
              value={filterCategory}
            >
              <option value="">All Categories</option>
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Garbage">Garbage</option>
              <option value="Others">Others</option>
            </select>

            <select
              className="select select-bordered w-full md:w-auto"
              onChange={handleFilterChange(setFilterStatus)}
              value={filterStatus}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              className="select select-bordered w-full md:w-auto"
              onChange={handleFilterChange(setFilterPriority)}
              value={filterPriority}
            >
              <option value="">All Priority</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} refetch={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-gray-400">
            No issues found matching your criteria.
          </h3>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`join-item btn ${
                  page === idx + 1 ? "btn-active" : ""
                }`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="join-item btn"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllIssues;
