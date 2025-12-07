import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa';

const AssignedIssues = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    // Fetch Assigned Issues
    const { data: issues = [], refetch } = useQuery({
        queryKey: ['assigned-issues', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosPublic.get(`/staff/${user.email}/issues`);
            return res.data;
        }
    });

    const handleStatusChange = async (issue, newStatus) => {
        try {
            const res = await axiosPublic.patch(`/issues/${issue._id}/status`, {
                newStatus,
                updatedBy: user.email,
                staffEmail: user.email // for timeline msg
            });

            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire('Updated!', `Status changed to ${newStatus}`, 'success');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold my-4">My Assigned Tasks: {issues.length}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map(issue => (
                    <div key={issue._id} className="card bg-base-100 shadow-xl border border-base-200">
                        <figure className="h-48 overflow-hidden">
                            <img src={issue.image || issue.img} alt={issue.title} className="w-full h-full object-cover" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                {issue.title}
                                <div className={`badge ${issue.priority === 'high' ? 'badge-error' : 'badge-ghost'}`}>{issue.priority}</div>
                            </h2>
                            <p className="text-sm text-gray-500">{issue.location}</p>
                            <p className="text-sm line-clamp-2">{issue.description}</p>
                            
                            <div className="card-actions justify-between items-center mt-4">
                                <span className={`badge ${issue.status === 'pending' ? 'badge-warning' : issue.status === 'in-progress' ? 'badge-info' : 'badge-success'}`}>
                                    {issue.status}
                                </span>
                                
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn text-black btn-sm btn-primary">Update Status</label>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><a onClick={() => handleStatusChange(issue, 'in-progress')}>In Progress</a></li>
                                        <li><a onClick={() => handleStatusChange(issue, 'resolved')}>Resolved</a></li>
                                        <li><a onClick={() => handleStatusChange(issue, 'closed')}>Closed</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {issues.length === 0 && <p className="text-gray-500 col-span-full text-center py-10">No issues assigned to you yet.</p>}
            </div>
        </div>
    );
};

export default AssignedIssues;
