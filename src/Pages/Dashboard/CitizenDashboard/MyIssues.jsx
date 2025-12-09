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
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    const { data: issues = [], isLoading, refetch } = useQuery({
        queryKey: ['myIssues', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
             const res = await axiosPublic.get(`/citizen/stats/${user.email}`);
             return res.data.issuesList; 
        }
    });

    const categories = [...new Set(issues.map(issue => issue.category))];

    const filteredIssues = issues.filter(issue => {
        const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
        return matchesStatus && matchesCategory;
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
            
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <select 
                    className="select select-bordered w-full md:w-xs"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>

                <select 
                    className="select select-bordered w-full md:w-xs"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

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
                        {filteredIssues.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-400">No issues found.</td></tr>
                        ) : (
                            filteredIssues.map(issue => (
                                <tr key={issue._id} className="hover">
                                    <td>
                                        <div className="font-bold">{issue.title}</div>
                                        <div className="text-sm opacity-50 truncate w-48">{issue.location}</div>
                                    </td>
                                    <td>{issue.category}</td>
                                    <td>
                                        <div className={`badge ${issue.status === 'resolved' ? 'badge-success' : issue.status === 'pending' ? 'badge-warning' : issue.status === 'in-progress' ? 'badge-info' : 'badge-neutral'} badge-sm uppercase`}>
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
