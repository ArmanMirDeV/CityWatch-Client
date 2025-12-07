import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import { FaUsers, FaUserShield, FaClipboardList, FaCheckDouble } from 'react-icons/fa';

const AdminOverview = () => {
    const axiosPublic = useAxiosPublic();

    // Fetch Stats (Creating a quick aggregation here, ideally backend should provide a single stats endpoint)
    // We can fetch /users (length), /staff (length), /issues (totalCount)
    // This is a bit inefficient but works for now without new backend API

    const { data: usersCount = 0 } = useQuery({
        queryKey: ['total-users'],
        queryFn: async () => {
             const res = await axiosPublic.get('/users');
             return res.data.length;
        }
    });

    const { data: staffCount = 0 } = useQuery({
        queryKey: ['total-staff'],
        queryFn: async () => {
             const res = await axiosPublic.get('/staff');
             return res.data.length;
        }
    });

    const { data: issuesData = {} } = useQuery({
        queryKey: ['total-issues-stats'],
        queryFn: async () => {
             const res = await axiosPublic.get('/issues?limit=1'); // minimal fetch just for count
             return res.data;
        }
    });

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold my-4">System Overview</h2>
            
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <div className="stat bg-white shadow-xl rounded-2xl border border-gray-100">
                    <div className="stat-figure text-primary">
                        <FaUsers className="text-4xl" />
                    </div>
                    <div className="stat-title font-semibold">Total Users</div>
                    <div className="stat-value text-primary">{usersCount}</div>
                    <div className="stat-desc">Registered citizens</div>
                </div>
                
                 <div className="stat bg-white shadow-xl rounded-2xl border border-gray-100">
                    <div className="stat-figure text-secondary">
                        <FaUserShield className="text-4xl" />
                    </div>
                    <div className="stat-title font-semibold">Total Staff</div>
                    <div className="stat-value text-secondary">{staffCount}</div>
                    <div className="stat-desc">Active staff members</div>
                </div>

                 <div className="stat bg-white shadow-xl rounded-2xl border border-gray-100">
                    <div className="stat-figure text-accent">
                        <FaClipboardList className="text-4xl" />
                    </div>
                    <div className="stat-title font-semibold">Total Issues</div>
                    <div className="stat-value text-accent">{issuesData.totalCount || 0}</div>
                    <div className="stat-desc">Reported by citizens</div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
