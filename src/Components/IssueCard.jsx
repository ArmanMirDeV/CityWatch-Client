import React from 'react';
import { FaMapMarkerAlt, FaArrowUp, FaCalendarAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import useAuth from '../Hooks/useAuth';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const IssueCard = ({ issue, refetch }) => {
    const { _id, title, description, category, status, priority, location, image, upvotes, createdAt } = issue;
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    
    const isUpvoted = user && upvotes.includes(user.email);

    const handleUpvote = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (issue.userEmail === user.email) {
             Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You cannot upvote your own issue!",
            });
            return;
        }

        if (isUpvoted) {
             Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You already upvoted this issue!",
            });
            return;
        }

        try {
            const res = await axiosPublic.patch(`/issues/upvote/${_id}`, { userEmail: user.email });
            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Upvoted Successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
             console.error(error);
             Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong!",
            });
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <figure className="relative h-48 overflow-hidden">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    <div className={`badge ${status === 'resolved' ? 'badge-success' : status === 'pending' ? 'badge-warning' : 'badge-neutral'} badge-sm uppercase font-semibold text-white`}>
                        {status}
                    </div>
                     {priority === 'high' && (
                        <div className="badge badge-error badge-sm uppercase font-semibold text-white">
                            High Priority
                        </div>
                    )}
                </div>
            </figure>
            <div className="card-body p-4">
                <div className="flex justify-between items-start">
                     <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{category}</p>
                     <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FaCalendarAlt /> {new Date(createdAt).toLocaleDateString()}
                     </p>
                </div>
               
                <h2 className="card-title text-xl font-bold text-gray-800 line-clamp-1" title={title}>
                    {title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
                
                <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="truncate">{location}</span>
                </div>

                <div className="card-actions justify-between items-center mt-4 border-t pt-4">
                     <button 
                        onClick={handleUpvote}
                        className={`btn btn-sm ${isUpvoted ? 'btn-black' : 'btn-outline btn-blue-900'} gap-2`}
                        disabled={issue.userEmail === user?.email}
                     >
                        <FaArrowUp /> 
                        <span>{upvotes.length}</span>
                    </button>
                    
                    <Link to={`/issue-details/${_id}`} className="btn btn-sm btn-neutral">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default IssueCard;
