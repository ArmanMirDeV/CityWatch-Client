import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { FaTrash, FaUserTie } from 'react-icons/fa';

const ManageStaff = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();

    const { data: staff = [], refetch } = useQuery({
        queryKey: ['staff'],
        queryFn: async () => {
            const res = await axiosPublic.get('/staff');
            return res.data;
        }
    });

    const onSubmit = async (data) => {
         
        const staffData = {
            name: data.name,
            email: data.email,
            password: data.password, 
            role: 'staff',
            photoURL: data.image || '' ||data.photoURL
        };
       
        

        try {
            const res = await axiosPublic.post('/staff', staffData);
            if (res.data.insertedId) {
                reset();
                refetch();
                Swal.fire('Success!', 'Staff member added successfully.', 'success');
            } else {
                Swal.fire('Error!', res.data.message || 'Failed to add staff.', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', 'Something went wrong.', 'error');
        }
    };
    
    const handleDeleteStaff = (id) => {
         Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosPublic.delete(`/staff/${id}`);
                if (res.data.deletedCount > 0) {
                    refetch();
                    Swal.fire('Deleted!', 'Staff member has been deleted.', 'success');
                }
            }
        });
    }

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold my-4">Manage Staff</h2>
            
            {/* Add Staff Form */}
            <div className="bg-base-200 p-6 rounded-lg mb-8 shadow-md">
                <h3 className="text-xl font-bold mb-4">Add New Staff</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">Name</label>
                        <input type="text" {...register("name", { required: true })} className="input input-bordered" placeholder="Staff Name" />
                        {errors.name && <span className="text-error">Name is required</span>}
                    </div>
                     <div className="form-control">
                        <label className="label">Email</label>
                        <input type="email" {...register("email", { required: true })} className="input input-bordered" placeholder="Staff Email" />
                         {errors.email && <span className="text-error">Email is required</span>}
                    </div>
                    <div className="form-control">
                        <label className="label">Password (for login)</label>
                        <input type="text" {...register("password", { required: true, minLength: 6 })} className="input input-bordered" placeholder="Password" />
                         {errors.password && <span className="text-error">Password must be at least 6 chars</span>}
                    </div>
                     <div className="form-control">
                        <label className="label">Photo URL (Optional)</label>
                        <input type="url" {...register("photoURL")} className="input input-bordered" placeholder="https://..." />
                    </div>
                    <div className="form-control md:col-span-2 mt-4">
                        <button className="btn btn-primary text-black w-full md:w-auto"><FaUserTie /> Add Staff</button>
                    </div>
                </form>
            </div>

            <div className="divider">Existing Staff</div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-xl">
                <table className="table w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>#</th>
                            <th>Info</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map((member, index) => (
                            <tr key={member._id}>
                                <th>{index + 1}</th>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={member.photoURL || "/default-avatar.png"} alt="Avatar" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{member.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{member.email}</td>
                                <td><span className="badge badge-info text-white">Staff</span></td>
                                <td>
                                    <button onClick={() => handleDeleteStaff(member._id)} className="btn btn-ghost btn-xs text-error">
                                        <FaTrash /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                         {staff.length === 0 && <tr><td colSpan="5" className="text-center">No staff found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStaff;
