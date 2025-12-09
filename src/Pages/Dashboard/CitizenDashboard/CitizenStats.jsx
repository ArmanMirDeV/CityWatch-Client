import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';

import { FaClipboardList, FaSpinner, FaCheckCircle, FaTimesCircle, FaChartPie, FaHourglassHalf, FaMoneyBillWave } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const CitizenStats = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats, isLoading } = useQuery({
        queryKey: ['citizenStats', user?.email],
        queryFn: async () => {
             const res = await axiosSecure.get(`/citizen/stats/${user.email}`);
             return res.data;
        },
        enabled: !!user?.email
    });

    if (loading || isLoading || !stats) return <div className="flex justify-center p-10"><span className="loading loading-dots loading-lg"></span></div>;

    const data = [
        { name: 'Pending', value: stats.pending, color: '#fbbd23' },
        { name: 'In Progress', value: stats.inProgress, color: '#3abff8' },
        { name: 'Resolved', value: stats.resolved, color: '#36d399' },
        { name: 'Closed', value: stats.closed, color: '#ef4444' },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="stat bg-white shadow-lg rounded-xl border-l-4 border-primary">
                    <div className="stat-figure text-primary">
                        <FaClipboardList className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Submitted</div>
                    <div className="stat-value text-primary">{stats.total}</div>
                </div>
                
                 <div className="stat bg-white shadow-lg rounded-xl border-l-4 border-warning">
                    <div className="stat-figure text-warning">
                        <FaSpinner className="text-3xl" />
                    </div>
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-warning">{stats.pending}</div>
                </div>

                <div className="stat bg-white shadow-lg rounded-xl border-l-4 border-info">
                    <div className="stat-figure text-info">
                        <FaHourglassHalf className="text-3xl" />
                    </div>
                    <div className="stat-title">In Progress</div>
                    <div className="stat-value text-info">{stats.inProgress}</div>
                </div>

                 <div className="stat bg-white shadow-lg rounded-xl border-l-4 border-success">
                    <div className="stat-figure text-success">
                        <FaCheckCircle className="text-3xl" />
                    </div>
                    <div className="stat-title">Resolved</div>
                    <div className="stat-value text-success">{stats.resolved}</div>
                </div>

                <div className="stat bg-white shadow-lg rounded-xl border-l-4 border-error">
                    <div className="stat-figure text-error">
                        <FaTimesCircle className="text-3xl" />
                    </div>
                    <div className="stat-title">Closed</div>
                    <div className="stat-value text-error">{stats.closed}</div>
                </div>

                <div className="stat bg-white shadow-lg rounded-xl border-l-4 border-secondary">
                    <div className="stat-figure text-secondary">
                        <FaMoneyBillWave className="text-3xl" />
                    </div>
                    <div className="stat-title">Total Payments</div>
                    <div className="stat-value text-secondary">{stats.totalPayments} BDT</div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex flex-col items-center justify-center">
                 <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FaChartPie/> Issues Status Distribution</h3>
                 {stats.total > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                 ) : (
                     <p className="text-gray-400">No data available to display chart.</p>
                 )}
            </div>
        </div>
    );
};

export default CitizenStats;
