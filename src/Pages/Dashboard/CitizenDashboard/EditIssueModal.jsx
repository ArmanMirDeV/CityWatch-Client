import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const EditIssueModal = ({ issue, onClose, refetch }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        if (issue) {
            reset({
                title: issue.title,
                description: issue.description,
                category: issue.category,
                location: issue.location,
                image: issue.image || issue.img
            });
        }
    }, [issue, reset]);

    const onSubmit = async (data) => {
        const updateData = {
            ...data,
            userEmail: issue.userEmail // Ensure email is passed for timeline update
        };

        try {
            const res = await axiosPublic.put(`/issues/${issue._id}`, updateData);
            if (res.data.modifiedCount > 0) {
                refetch();
                onClose();
                Swal.fire('Updated!', 'Issue has been updated.', 'success');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', 'Failed to update issue.', 'error');
        }
    };

    if (!issue) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
                 <h3 className="text-xl font-bold mb-4">Edit Issue</h3>
                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="form-control">
                        <label className="label">Title</label>
                        <input type="text" className="input input-bordered" {...register("title", { required: true })} />
                        {errors.title && <span className="text-error text-sm">Title is required</span>}
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="form-control w-1/2">
                            <label className="label">Category</label>
                            <select className="select select-bordered" {...register("category", { required: true })}>
                                <option value="Roads">Roads</option>
                                <option value="Water">Water</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Garbage">Garbage</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="form-control w-1/2">
                            <label className="label">Location</label>
                            <input type="text" className="input input-bordered" {...register("location", { required: true })} />
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label">Image URL</label>
                        <input type="url" className="input input-bordered" {...register("image", { required: true })} />
                         {errors.image && <span className="text-error text-sm">Image URL is required</span>}
                    </div>

                     <div className="form-control">
                        <label className="label">Description</label>
                        <textarea className="textarea textarea-bordered h-24" {...register("description", { required: true })}></textarea>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Update</button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default EditIssueModal;
