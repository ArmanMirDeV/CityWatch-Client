import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import { Link } from 'react-router';
import EditIssueModal from './EditIssueModal';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const MyIssues = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [selectedIssue, setSelectedIssue] = useState(null);

    const { data: issues = [], isLoading, refetch } = useQuery({
        queryKey: ['myIssues', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
             // Assuming existing getAll API can filter by email or fetching all and filtering here for simplicity if separate API not made.
             // Actually, the requirement said "List all issues from logged-in user".
             // We can use the existing /citizen/stats logic or better, create a specific query or use the filter features of GET /issues?search=email? NO, search is text.
             // Let's rely on fetching all and filtering client side OR make a new endpoint?
             // Since we didn't plan a new endpoint for LISTING specific user issues in backend plan, I will use /citizen/stats endpoint if it returned issues, but it returns stats object.
             // Wait, I missed adding a specific endpoint to list user issues in the backend plan.
             // However, I can reuse the /issues endpoint if I added filter by userEmail? I added search/status/cat/priority.
             // Let's modify the GET /issues call to support filtering by userEmail if I can, OR just filter client side for now if dataset is small, but that's bad practice.
             // The implementation plan said: "My Issues Page: List all issues from logged-in user".
             // I will use client side filtering on the client for now or check if I can quickly add a query param support to backend.
             // Actually, let's just fetch all issues and filter. Or use the stats endpoint if I modify it? No.
             // Let's assume I can add userEmail filter to GET /issues quickly or just use client side filtering on the response of GET /issues WITHOUT pagination limit? No, that's heavy.
             // Re-checking backend code... GET /issues accepts params. I can add userEmail support easily if I edit backend again.
             // BUT, for now, let's TRY to use CLIENT SIDE filtering on a "fetch all" approach (bad) or better:
             // Let's use `axiosPublic.get('/issues?limit=1000')` and filter. It's a hack but works for prototype.
             // ALTERNATIVELY: I see `app.get("/citizen/stats/:email")` fetches all issues for stats. I can just return the issues array too in that endpoint!
             
             // Let's use the stats endpoint since it already fetches `find({userEmail: email})`. I will MODIFY the backend to return `issues` list in the stats response or create a new endpoint.
             // To be clean, I should have a separate endpoint.
             // Let's just fetch from `/citizen/stats/:email` and I will modify backend to include the full list there, or just add a new `GET /citizen/issues/:email`.
             // I'll stick to modifying the `GET /citizen/stats/:email` to also return the array of issues, as "stats" usually implies summary.
             // Actually, I'll just add `app.get('/citizen/issues/:email')` quickly in the next step or use what I have.
             // Wait, `GET /citizen/stats/:email` in MY previous step does: `const issues = await issuesCollection.find(query).toArray();` then calculates stats. I can just return `issues` in the response too!
             
             const res = await axiosPublic.get(`/citizen/stats/${user.email}`);
             return res.data.issuesList; // I need to update backend to return this.
        }
    });

    const handleDelete = (id) => {
         Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosPublic.delete(`/issues/${id}`);
                    if (res.data.deletedCount > 0) {
                        Swal.fire('Deleted!', 'Your issue has been deleted.', 'success');
                        refetch();
                    }
                } catch (error) {
                    Swal.fire('Error!', 'Something went wrong.', 'error');
                }
            }
        });
    };

    if (isLoading) return <div className="flex justify-center p-10"><span className="loading loading-dots loading-lg"></span></div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Reported Issues</h2>
            <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                <table className="table w-full">
                    {/* head */}
                    <thead className="bg-base-200">
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issues.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-400">No issues reported yet.</td></tr>
                        ) : (
                            issues.map(issue => (
                                <tr key={issue._id} className="hover">
                                    <td>
                                        <div className="font-bold">{issue.title}</div>
                                        <div className="text-sm opacity-50 truncate w-48">{issue.location}</div>
                                    </td>
                                    <td>{issue.category}</td>
                                    <td>
                                        <div className={`badge ${issue.status === 'resolved' ? 'badge-success' : issue.status === 'pending' ? 'badge-warning' : 'badge-neutral'} badge-sm uppercase`}>
                                            {issue.status}
                                        </div>
                                    </td>
                                    <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                                    <td className="flex gap-2">
                                        <Link to={`/issue-details/${issue._id}`} className="btn btn-ghost btn-xs tooltip" data-tip="View Details">
                                            <FaEye className="text-info text-lg" />
                                        </Link>
                                        {issue.status === 'pending' && (
                                            <button className="btn btn-ghost btn-xs tooltip" data-tip="Edit" onClick={() => setSelectedIssue(issue)}>
                                                <FaEdit className="text-warning text-lg" />
                                            </button>
                                        )}
                                        <button className="btn btn-ghost btn-xs tooltip" data-tip="Delete" onClick={() => handleDelete(issue._id)}>
                                            <FaTrash className="text-error text-lg" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {selectedIssue && (
                <EditIssueModal 
                    issue={selectedIssue} 
                    onClose={() => setSelectedIssue(null)} 
                    refetch={refetch}
                />
            )}
        </div>
    );
};

export default MyIssues;
