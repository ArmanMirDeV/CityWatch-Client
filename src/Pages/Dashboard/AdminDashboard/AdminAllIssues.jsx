import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { FaUserPlus, FaCheckCircle } from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth';

const AdminAllIssues = () => {
    const axiosPublic = useAxiosPublic();
    const { user: adminUser } = useAuth();
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState("");

    // Fetch Issues
    const { data: issuesData = {}, refetch: refetchIssues } = useQuery({
        queryKey: ['admin-issues'],
        queryFn: async () => {
            // Reusing existing API, maybe with a specific Admin query if needed, or just fetch all first page for now
            // Or better: fetch pending/all issues without pagination for this view or add pagination later
            // For admin management, pagination is good. Let's use the same structure as AllIssues but simplified view
            const res = await axiosPublic.get('/issues?limit=50'); // Fetch more for admin view
            return res.data; 
        }
    });
    
    // Fetch Staff for assignment dropdown
    const { data: staffList = [] } = useQuery({
        queryKey: ['staff-list'],
        queryFn: async () => {
            const res = await axiosPublic.get('/staff');
            return res.data;
        }
    });

    const handleAssignStaff = async () => {
        if (!selectedIssue || !selectedStaff) return;

        try {
            const res = await axiosPublic.patch(`/issues/assign/${selectedIssue._id}`, {
                staffEmail: selectedStaff,
                adminEmail: adminUser.email
            });

            if (res.data.modifiedCount > 0) {
                refetchIssues();
                setSelectedIssue(null);
                setSelectedStaff("");
                // Close modal
                document.getElementById('assign_modal').close();
                Swal.fire('Assigned!', `Issue assigned to ${selectedStaff}`, 'success');
            } else if (res.data.message) {
                 Swal.fire('Error', res.data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to assign staff', 'error');
        }
    };

    const openAssignModal = (issue) => {
        setSelectedIssue(issue);
        document.getElementById('assign_modal').showModal();
    };

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold my-4">All Issues (Admin View)</h2>
            
            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {issuesData.issues?.map((issue) => (
                            <tr key={issue._id}>
                                <td>
                                    <div className="font-bold">{issue.title}</div>
                                    <div className="text-sm opacity-50">{issue.location}</div>
                                </td>
                                <td>{issue.category}</td>
                                <td>
                                    <span className={`badge ${issue.status === 'pending' ? 'badge-warning' : issue.status === 'resolved' ? 'badge-success' : 'badge-info'}`}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td>
                                    {issue.assignedStaff ? (
                                        <span className="badge badge-neutral text-white gap-1"><FaCheckCircle/> {issue.assignedStaff}</span>
                                    ) : (
                                        <span className="text-gray-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td>
                                    {!issue.assignedStaff && (
                                        <button onClick={() => openAssignModal(issue)} className="btn text-black btn-xs btn-primary">
                                            <FaUserPlus /> Assign
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Assign Modal */}
            <dialog id="assign_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Assign Staff</h3>
                    <p className="py-4">Assign a staff member to resolve issue: <strong>{selectedIssue?.title}</strong></p>
                    
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Select Staff</span>
                        </label>
                        <select 
                            className="select select-bordered" 
                            value={selectedStaff} 
                            onChange={(e) => setSelectedStaff(e.target.value)}
                        >
                            <option value="" disabled>Pick one</option>
                            {staffList.map(staff => (
                                <option key={staff._id} value={staff.email}>{staff.name} ({staff.email})</option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-ghost mr-2">Cancel</button>
                        </form>
                        <button className="btn btn-primary" onClick={handleAssignStaff} disabled={!selectedStaff}>Confirm Assignment</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AdminAllIssues;
