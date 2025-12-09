import React from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

import StatsCard from '../../../Components/Dashboard/StatsCard';
import { 
    FaUsers, FaClipboardList, FaCheckCircle, FaHourglassHalf, 
    FaTimesCircle, FaMoneyBillWave, FaArrowRight 
} from 'react-icons/fa';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { Link } from 'react-router';

const AdminOverview = () => {
    const axiosSecure = useAxiosSecure();

    // 1. Fetch System Stats
    const { data: stats = {} } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
             const res = await axiosSecure.get("/admin/stats");
             return res.data;
        }
    });

    // 2. Fetch Latest Payments
    const { data: latestPayments = [] } = useQuery({
        queryKey: ['latest-payments'],
        queryFn: async () => {
             const res = await axiosSecure.get("/payments?limit=5");
             return res.data;
        }
    });

    // 3. Fetch Latest Issues
    const { data: latestIssuesData = {} } = useQuery({
        queryKey: ['latest-issues'],
        queryFn: async () => {
             // Reusing /issues endpoint, assuming it returns { issues: [...] }
             const res = await axiosSecure.get("/issues?limit=5");
             return res.data;
        }
    });
    const latestIssues = latestIssuesData.issues || [];

    // 4. Fetch Latest Users
    const { data: latestUsers = [] } = useQuery({
        queryKey: ['latest-users'],
        queryFn: async () => {
             const res = await axiosSecure.get('/users?limit=5');
             return res.data;
        }
    });

    // Prepare Chart Data
    const chartData = [
        { name: 'Resolved', count: stats.resolvedIssues || 0, color: '#4ade80' }, // green-400
        { name: 'Pending', count: stats.pendingIssues || 0, color: '#fbbf24' },  // amber-400
        { name: 'Rejected', count: stats.rejectedIssues || 0, color: '#f87171' }, // red-400
    ];

    return (
        <div className="w-full p-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
            
            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <StatsCard 
                    title="Total Issues" 
                    value={stats.totalIssues || 0} 
                    icon={FaClipboardList} 
                    color="border-purple-500" 
                    description="All reported issues"
                />
                <StatsCard 
                    title="Resolved Issues" 
                    value={stats.resolvedIssues || 0} 
                    icon={FaCheckCircle} 
                    color="border-green-500" 
                    description="Successfully fixed"
                />
                <StatsCard 
                    title="Pending Issues" 
                    value={stats.pendingIssues || 0} 
                    icon={FaHourglassHalf} 
                    color="border-amber-500" 
                    description="Awaiting action"
                />
                 <StatsCard 
                    title="Rejected Issues" 
                    value={stats.rejectedIssues || 0} 
                    icon={FaTimesCircle} 
                    color="border-red-500" 
                    description="Invalid reports"
                />
                <StatsCard 
                    title="Total Users" 
                    value={stats.totalUsers || 0} 
                    icon={FaUsers} 
                    color="border-blue-500" 
                    description="Registered citizens"
                />
                <StatsCard 
                    title="Total Revenue" 
                    value={`Tk ${stats.totalRevenue || 0}`} 
                    icon={FaMoneyBillWave} 
                    color="border-yellow-500" 
                    description="From subscriptions"
                />
            </div>

            {/* Main Content Grid: Chart + Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                
                {/* Chart Section */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 text-gray-700">Issue Status Distribution</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Latest Payments */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-700">Latest Payments</h3>
                        <span className="text-sm text-gray-400">Recent 5</span>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>TXID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {latestPayments.map(pay => (
                                    <tr key={pay._id}>
                                        <td className="text-xs">{pay.email}<br/><span className="text-[10px] opacity-50">{new Date(pay.date).toLocaleDateString()}</span></td>
                                        <td className="font-semibold text-success">Tk {pay.price}</td>
                                        <td className="text-xs font-mono">{pay.transactionId?.slice(0, 10)}...</td>
                                    </tr>
                                ))}
                                {latestPayments.length === 0 && (
                                    <tr><td colSpan="3" className="text-center text-gray-400">No payments found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Bottom Lists: Latest Issues & Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Latest Issues */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-700">Latest Issues</h3>
                        <Link to="/dashboard/admin/all-issues" className="btn btn-xs btn-outline">View All <FaArrowRight/></Link>
                    </div>
                    <ul className="space-y-3">
                        {latestIssues.map(issue => (
                            <li key={issue._id} className="flex justify-between items-center p-3 bg-base-100 rounded-lg hover:bg-base-200 transition">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-12 rounded-full ${issue.status === 'resolved' ? 'bg-green-500' : issue.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                    <div>
                                        <div className="font-bold text-sm truncate w-40 md:w-60">{issue.title}</div>
                                        <div className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleDateString()} • {issue.status}</div>
                                    </div>
                                </div>
                                <div className="badge badge-sm">{issue.category}</div>
                            </li>
                        ))}
                         {latestIssues.length === 0 && (
                            <li className="text-center text-gray-400 py-4">No issues found</li>
                        )}
                    </ul>
                </div>

                {/* Latest Users */}
                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-700">New Users</h3>
                         <Link to="/dashboard/admin/manage-users" className="btn btn-xs btn-outline">View All <FaArrowRight/></Link>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="table w-full">
                            <tbody>
                                {latestUsers.map(user => (
                                    <tr key={user._id} className="hover">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-10 h-10">
                                                        <img src={user.photoURL} alt={user.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.name}</div>
                                                    <div className="text-sm opacity-50">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                           <span className={`badge ${user.role === 'admin' ? 'badge-primary text-black' : 'badge-ghost'} badge-sm`}>{user.role || 'Citizen'}</span>
                                        </td>
                                    </tr>
                                ))}
                                 {latestUsers.length === 0 && (
                                    <tr><td colSpan="2" className="text-center text-gray-400">No users found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminOverview;
