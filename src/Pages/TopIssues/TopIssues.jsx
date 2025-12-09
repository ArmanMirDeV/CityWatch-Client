import React from "react";
import { useQuery } from "@tanstack/react-query";
import IssueCard from "../../Components/IssueCard";
import axios from "axios";
import { BASE_URL } from "../../Utils/constants";

const TopIssues = () => {
  
  const { data: issues = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["topIssues"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/issues?priority=high`);
      return res.data.issues || []; // api returns { issues: [...], totalCount } likely, or just array? Server sends { issues: result, totalCount } if searching/filtering, but /issues?priority=high hits the same endpoint.
      // Let's check backend: app.get("/issues") returns { issues: result, totalCount: totalIssues }.
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-blue-800 uppercase">
          Top Paid Issues
        </h2>
        <p className="text-gray-600 mt-2">
          High priority issues that need immediate attention
        </p>
        <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
      </div>

      {issues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} refetch={refetch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-200 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-500">
            No Top Issues Found
          </h3>
          <p className="text-gray-400 mt-2">
            Check back later for high priority updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopIssues;
