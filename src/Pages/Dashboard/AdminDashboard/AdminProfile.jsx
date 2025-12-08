import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { FaUserShield, FaEnvelope, FaEdit, FaSave } from 'react-icons/fa';

const AdminProfile = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        photoURL: ''
    });

    const { data: dbUser, isLoading, refetch } = useQuery({
        queryKey: ['admin-user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
             const res = await axiosPublic.get(`/users/${user.email}`);
             return res.data;
        }
    });

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
                Swal.fire('Success', 'Admin Profile updated successfully', 'success');
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Profile</h2>
            
            <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200">
                <figure className="p-8 bg-base-200 flex flex-col justify-center items-center lg:w-1/3">
                    {editForm.photoURL && isEditing ? (
                        <img src={editForm.photoURL} alt="Preview" className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover" 
                             onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                    ) : (
                        (dbUser?.photoURL || user?.photoURL) ? (
                            <img src={dbUser?.photoURL || user?.photoURL} alt="Admin" className="w-32 h-32 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
                        ) : (
                            <FaUserShield className="text-9xl text-gray-400 mb-4" />
                        )
                    )}
                    
                    <div className="badge badge-primary text-black gap-1 p-3">
                        <FaUserShield /> Administrator
                    </div>
                </figure>
                
                <div className="card-body">
                    {/* Header with Edit Button */}
                    <div className="flex justify-between items-start">
                        <h2 className="card-title text-3xl flex items-center gap-2">
                             {isEditing ? 'Edit Profile' : (dbUser?.name || user?.displayName)}
                        </h2>
                        {!isEditing && (
                            <button onClick={startEditing} className="btn btn-ghost bg-primary text-black btn-sm ">
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
                                <button type="submit" className="btn btn-primary text-white"><FaSave /> Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-2 space-y-3">
                            <p className="flex items-center gap-2 text-gray-600"><FaEnvelope /> {user?.email}</p>
                            
                            <div className="divider"></div>
                            
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">Role:</span>
                                    <span className="badge badge-lg badge-ghost">System Administrator</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <span className="font-semibold">Member Since:</span>
                                     <span>{dbUser?.createdAt ? new Date(dbUser.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="alert alert-info shadow-sm mt-4">
                                    <span>Admins have full access to manage users, staff, and issues.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
