import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { FaUserCircle, FaCrown, FaEnvelope, FaBan, FaEdit, FaSave, FaFileInvoiceDollar } from 'react-icons/fa';
import { downloadInvoice as downloadInv } from '../../../Utils/invoiceGenerator';

import SubscriptionModal from '../../../Components/Dashboard/SubscriptionModal';

const UserProfile = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    
    // Modal State
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        photoURL: ''
    });

    const { data: dbUser, isLoading, refetch } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
             const res = await axiosPublic.get(`/users/${user.email}`);
             return res.data;
        }
    });

    // Initialize form when data loads or edit mode starts
    const startEditing = () => {
        setEditForm({
            name: dbUser?.name || user?.displayName || '',
            photoURL: dbUser?.photoURL || user?.photoURL || ''
        });
        setIsEditing(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosPublic.put(`/users/${user.email}`, {
                name: editForm.name,
                photoURL: editForm.photoURL
            });

            if (res.data.modifiedCount > 0) {
                Swal.fire('Success', 'Profile updated successfully', 'success');
                refetch();
                setIsEditing(false);
            } else {
                Swal.fire('Info', 'No changes made', 'info');
                setIsEditing(false);
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update profile', 'error');
        }
    };

    if (isLoading) return <div className="flex justify-center p-10"><span className="loading loading-dots loading-lg"></span></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
            
            <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200">
                <figure className="p-8 bg-base-200 flex flex-col justify-center items-center lg:w-1/3">
                    {editForm.photoURL && isEditing ? (
                        <img src={editForm.photoURL} alt="Preview" className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover" 
                             onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                    ) : (
                        (dbUser?.photoURL || user?.photoURL) ? (
                            <img src={dbUser?.photoURL || user?.photoURL} alt="User" className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
                        ) : (
                            <FaUserCircle className="text-9xl text-gray-400 mb-4" />
                        )
                    )}
                    
                    {dbUser?.isPremium && (
                        <div className="badge badge-warning gap-1 p-3">
                            <FaCrown className="text-black" /> Premium Member
                        </div>
                    )}
                </figure>
                
                <div className="card-body">
                    {/* Header with Edit Button */}
                    <div className="flex justify-between items-start">
                        <h2 className="card-title text-3xl flex items-center gap-2">
                             {isEditing ? 'Edit Profile' : (dbUser?.name || user?.displayName)}
                        </h2>
                        {!isEditing && (
                            <button onClick={startEditing} className="btn btn-ghost btn-sm text-black">
                                <FaEdit /> Edit
                            </button>
                        )}
                    </div>

                    {/* Content / Edit Form */}
                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4 mt-2">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full" 
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Photo URL</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="input input-bordered w-full" 
                                    value={editForm.photoURL}
                                    onChange={(e) => setEditForm({...editForm, photoURL: e.target.value})}
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
                                <button type="submit" className="btn text-black btn-primary"><FaSave /> Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-2 space-y-3">
                            <p className="flex items-center gap-2 text-gray-600"><FaEnvelope /> {user?.email}</p>
                            
                            <div className="divider"></div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Account Status:</span>
                                    {dbUser?.isBlocked ? (
                                        <span className="badge badge-error gap-1"><FaBan /> Blocked</span>
                                    ) : (
                                        <span className="badge badge-success badge-outline">Active</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Membership:</span>
                                    {dbUser?.isPremium ? (
                                        <span className="text-warning font-bold flex items-center gap-1"><FaCrown /> Premium</span>
                                    ) : (
                                        <span className="text-gray-500">Free Tier (Limit 3 issues)</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className="font-semibold">Member Since:</span>
                                     <span>{dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions (Subscription) */}
                    {!isEditing && (
                        <div className="card-actions justify-end mt-8">
                            {!dbUser?.isPremium && (
                                <div className="flex flex-col items-end gap-2 bg-base-200 p-4 rounded-xl w-full">
                                    <div className="flex flex-col md:flex-row justify-between items-center w-full">
                                        <div>
                                             <h4 className="font-bold">Upgrade to Premium</h4>
                                             <p className="text-sm text-gray-500">Unlock unlimited issue reporting and priority support.</p>
                                        </div>
                                        <button className="btn btn-primary text-black mt-3 md:mt-0" onClick={() => setIsSubscriptionModalOpen(true)}>
                                            Subscribe (1000 TK)
                                        </button>
                                    </div>
                                </div>
                            )}
                             {dbUser?.isBlocked && (
                                <div className="alert alert-error shadow-lg">
                                    <span>Your account is blocked. Please contact authorities.</span>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Payment History Section */}
                    {!isEditing && (
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-4">Payment History</h3>
                            <PaymentHistory userEmail={user?.email} />
                        </div>
                    )}
                </div>
            </div>

            {/* Subscription Modal */}
            <SubscriptionModal 
                isOpen={isSubscriptionModalOpen} 
                onClose={() => setIsSubscriptionModalOpen(false)}
                userEmail={user?.email}
                refetch={refetch}
            />
        </div>
    );
};

// Sub-component for Payment History
const PaymentHistory = ({ userEmail }) => {
    const axiosPublic = useAxiosPublic();
    
    const { data: stats = {} } = useQuery({
        queryKey: ['citizenStats', userEmail],
        queryFn: async () => {
             const res = await axiosPublic.get(`/citizen/stats/${userEmail}`);
             return res.data;
        },
        enabled: !!userEmail
    });

    const payments = stats.paymentsList || [];

    if (payments.length === 0) return <p className="text-gray-500 italic">No payment history found.</p>;

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="table w-full">
                <thead className="bg-base-200">
                    <tr>
                        <th>Date</th>
                        <th>Transaction ID</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, idx) => (
                        <tr key={idx}>
                            <td>{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="font-mono text-xs">{payment.transactionId}</td>
                            <td>{payment.price} BDT</td>
                            <td>
                                <button 
                                    onClick={() => downloadInv(payment)}
                                    className="btn btn-xs btn-outline btn-info gap-1"
                                >
                                    <FaFileInvoiceDollar /> Invoice
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserProfile;
