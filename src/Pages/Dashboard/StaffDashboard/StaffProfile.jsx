import React, { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Authentication/Context/AuthContext';
import { useNavigate } from 'react-router';

const StaffProfile = () => {
    const { user, logOut } = useAuth();
    const { dbLogin } = useContext(AuthContext); // To update context if needed
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    
    // We need to fetch the full staff object including current password if we want to show it or manage it?
    // User object in context might be stale if updated properly.
    // Better fetch fresh data.
    
    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if (user) {
            // Fetch fresh staff data using the user's ID if available, or email?
            // The user object from dbLogin has _id.
            if (user._id) {
                axiosPublic.get(`/staff/${user._id}`).then(res => {
                    const data = res.data;
                    setValue('name', data.name);
                    setValue('email', data.email);
                    setValue('password', data.password);
                    setValue('photoURL', data.photoURL);
                });
            } else {
                 // Fallback if we only have email (Firebase-ish user state, but this is Staff dashboard so likely DB user)
                 // But wait, if they logged in via DB, user has _id.
                 setValue('name', user.displayName || user.name);
                 setValue('email', user.email);
            }
        }
    }, [user, axiosPublic, setValue]);

    const onSubmit = async (data) => {
        try {
            const res = await axiosPublic.patch(`/staff/${user._id}`, {
                name: data.name,
                email: data.email,
                password: data.password,
                photoURL: data.photoURL
            });

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    title: 'Success',
                    text: 'Profile updated. Please login again if you changed your email.',
                    icon: 'success'
                }).then(async () => {
                     // If email/password changed, maybe force logout?
                     // Or just update local state.
                     if (data.email !== user.email) {
                         await logOut();
                         navigate('/login');
                     } else {
                         // Update local context manually for smooth UX
                         const updatedUser = { ...user, name: data.name, email: data.email, photoURL: data.photoURL };
                         // We don't have a specific updateContext method for DB user without re-login or hack
                         // But if we use dbLogin it overwrites user in state
                         dbLogin(updatedUser);
                     }
                });
            } else {
                 Swal.fire('Info', 'No changes made or email already exists.', 'info');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update profile', 'error');
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-base-100 shadow-xl rounded-xl p-8 border border-base-200 mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Name</span>
                    </label>
                    <input type="text" {...register('name', { required: true })} className="input input-bordered w-full" />
                </div>
                
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Email</span>
                    </label>
                    <input type="email" {...register('email', { required: true })} className="input input-bordered w-full" />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Password</span>
                    </label>
                    <input type="text" {...register('password', { required: true, minLength: 6 })} className="input input-bordered w-full" />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-semibold">Photo URL</span>
                    </label>
                    <input type="url" {...register('photoURL')} className="input input-bordered w-full" placeholder="https://..." />
                </div>

                <div className="form-control mt-6">
                    <button className="btn btn-primary w-full text-black">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default StaffProfile;
