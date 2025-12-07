import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { FaUserCircle, FaCrown, FaEnvelope, FaBan } from 'react-icons/fa';

const UserProfile = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(false);

    const { data: dbUser, isLoading, refetch } = useQuery({
        queryKey: ['user', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosPublic.get(`/users/${user.email}`);
            return res.data;
        }
    });

    const handleSubscribe = async () => {
        setLoading(true);
        // Simulate payment
        setTimeout(async () => {
            try {
                const res = await axiosPublic.patch(`/users/premium/${user.email}`);
                if (res.data.modifiedCount > 0) {
                    refetch();
                    Swal.fire({
                        icon: 'success',
                        title: 'Subscription Successful',
                        text: 'Welcome to Premium!',
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Subscription failed', 'error');
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    if (isLoading) return <div className="flex justify-center p-10"><span className="loading loading-dots loading-lg"></span></div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
            
            <div className="card lg:card-side bg-base-100 shadow-xl border border-base-200">
                <figure className="p-8 bg-base-200 flex justify-center items-center">
                    {user?.photoURL ? (
                         <img src={user.photoURL} alt="User" className="w-32 h-32 rounded-full border-4 border-white shadow-md" />
                    ) : (
                        <FaUserCircle className="text-9xl text-gray-400" />
                    )}
                </figure>
                <div className="card-body">
                    <h2 className="card-title text-3xl flex items-center gap-2">
                        {dbUser?.name || user?.displayName}
                        {dbUser?.isPremium && <FaCrown className="text-warning text-2xl" title="Premium Member" />}
                    </h2>
                    <p className="flex items-center gap-2 text-gray-600"><FaEnvelope /> {user?.email}</p>
                    
                    <div className="mt-4 space-y-2">
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
                                <span className="badge badge-warning text-black gap-1"><FaCrown /> Premium</span>
                            ) : (
                                <span className="badge badge-neutral badge-outline">Free</span>
                            )}
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-6">
                        {!dbUser?.isPremium && (
                            <div className="flex flex-col items-end gap-2">
                                <p className="text-sm text-gray-500">Subscribe for unlimited reporting.</p>
                                <button className={`btn btn-primary text-black ${loading ? 'loading' : ''}`} onClick={handleSubscribe} disabled={loading}>
                                    Subscribe (1000 TK)
                                </button>
                            </div>
                        )}
                         {dbUser?.isBlocked && (
                            <div className="alert alert-error shadow-lg">
                                <span>Your account is blocked. Please contact authorities.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
