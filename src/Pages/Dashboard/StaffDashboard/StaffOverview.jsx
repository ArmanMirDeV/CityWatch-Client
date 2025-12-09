import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import useAuth from '../../../Hooks/useAuth';
import { FaCheckCircle, FaClipboardList, FaSpinner } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                 {/* Priority Chart */}
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-4 text-gray-700 w-full text-left">Issues by Priority</h3>
                    {stats.totalAssigned > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={[
                                { name: 'High', value: stats.byPriority?.high || 0, fill: '#ef4444' },
                                { name: 'Medium', value: stats.byPriority?.medium || 0, fill: '#fbbd23' },
                                { name: 'Normal', value: stats.byPriority?.normal || 0, fill: '#3abff8' },
                                { name: 'Low', value: stats.byPriority?.low || 0, fill: '#36d399' },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
                    )}
                 </div>

                 {/* Status Chart */}
                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-4 text-gray-700 w-full text-left">Issues by Status</h3>
                    {stats.totalAssigned > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Pending', value: stats.pending || 0, color: '#fbbd23' },
                                        { name: 'In Progress', value: stats.inProgress || 0, color: '#3abff8' },
                                        { name: 'Resolved', value: stats.resolved || 0, color: '#36d399' },
                                        { name: 'Closed', value: stats.closed || 0, color: '#ef4444' },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {[
                                        { name: 'Pending', value: stats.pending || 0, color: '#fbbd23' },
                                        { name: 'In Progress', value: stats.inProgress || 0, color: '#3abff8' },
                                        { name: 'Resolved', value: stats.resolved || 0, color: '#36d399' },
                                        { name: 'Closed', value: stats.closed || 0, color: '#ef4444' },
                                    ].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default StaffOverview;
