import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useAuth from '../../../Hooks/useAuth';
import { FaCheckCircle, FaClipboardList, FaSpinner } from 'react-icons/fa';

const StaffOverview = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();

    const { data: stats = {} } = useQuery({
        queryKey: ['staff-stats', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosPublic.get(`/staff/${user.email}/stats`);
            return res.data;
        }
    });

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold my-4">Welcome back, {user?.displayName}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <div className="stat bg-white shadow-xl rounded-2xl border border-gray-100">
                    <div className="stat-figure text-primary">
                        <FaClipboardList className="text-4xl" />
                    </div>
                    <div className="stat-title font-semibold">Assigned Tasks</div>
                    <div className="stat-value text-primary">{stats.totalAssigned || 0}</div>
                    <div className="stat-desc">Total issues assigned</div>
                </div>

                <div className="stat bg-white shadow-xl rounded-2xl border border-gray-100">
                    <div className="stat-figure text-secondary">
                        <FaSpinner className="text-4xl" />
                    </div>
                    <div className="stat-title font-semibold">Pending/In-Progress</div>
                    <div className="stat-value text-secondary">{(stats.totalAssigned - stats.resolved - stats.closed) || 0}</div>
                    <div className="stat-desc">Tasks needing attention</div>
                </div>

                <div className="stat bg-white shadow-xl rounded-2xl border border-gray-100">
                    <div className="stat-figure text-success">
                        <FaCheckCircle className="text-4xl" />
                    </div>
                    <div className="stat-title font-semibold">Resolved</div>
                    <div className="stat-value text-success">{stats.resolved || 0}</div>
                    <div className="stat-desc">Successfully fixed</div>
                </div>

                <div className="stat bg-white shadow-xl rounded-2xl border border-gray-100">
                    <div className="stat-figure text-info">
                        <FaCheckCircle className="text-4xl" />
                    </div>
                    <div className="stat-title font-semibold">Today's Activity</div>
                    <div className="stat-value text-info">{stats.todayTasks || 0}</div>
                    <div className="stat-desc">Tasks updated today</div>
                </div>
            </div>
        </div>
    );
};

export default StaffOverview;
