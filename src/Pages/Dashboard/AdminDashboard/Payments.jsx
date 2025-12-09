import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';
import { FaSearch, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Payments = () => {
    const axiosPublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // desc or asc

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['admin-payments'],
        queryFn: async () => {
            const res = await axiosPublic.get('/payments');
            return res.data;
        }
    });

    // 1. Process Data for Chart (Revenue per Month)
    const chartData = useMemo(() => {
        const monthlyRevenue = {};

        payments.forEach(payment => {
            if (!payment.date) return;
            const date = new Date(payment.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Dec 2025"
            
            if (!monthlyRevenue[monthYear]) {
                monthlyRevenue[monthYear] = 0;
            }
            monthlyRevenue[monthYear] += parseFloat(payment.price || 0);
        });

        return Object.keys(monthlyRevenue).map(key => ({
            name: key,
            revenue: monthlyRevenue[key]
        })).sort((a, b) => new Date(a.name) - new Date(b.name)); // Rough sort, better parsing might be needed if strictly chronological across years
    }, [payments]);

    // 2. Filter and Sort Table Data
    const filteredPayments = useMemo(() => {
        return payments.filter(payment => 
            (payment.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()))
        ).sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [payments, searchTerm, sortOrder]);

    const totalRevenue = payments.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0);

    return (
        <div className="w-full">
            <h2 className="text-3xl font-bold my-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-500"/> Payments History
            </h2>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat bg-white shadow-lg rounded-2xl border border-gray-100">
                    <div className="stat-title">Total Transactions</div>
                    <div className="stat-value">{payments.length}</div>
                </div>
                <div className="stat bg-white shadow-lg rounded-2xl border border-gray-100">
                    <div className="stat-title">Total Revenue</div>
                    <div className="stat-value text-green-600">{totalRevenue.toLocaleString()} BDT</div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-700">Monthly Revenue</h3>
                <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" name="Revenue (BDT)" fill="#36d399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table and Filters Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-bold">Transaction List</h3>
                    
                    <div className="flex gap-4">
                        {/* Search */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search email or TrxID..." 
                                className="input input-bordered pl-10 w-full max-w-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>

                        {/* Sort */}
                        <select 
                            className="select select-bordered"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="desc">Newest First</option>
                            <option value="asc">Oldest First</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th>#</th>
                                <th>Email</th>
                                <th>Amount</th>
                                <th>Transaction ID</th>
                                <th>Date</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment, index) => (
                                    <tr key={payment._id || index} className="hover:bg-base-50">
                                        <th>{index + 1}</th>
                                        <td className="font-medium">{payment.email}</td>
                                        <td className="text-green-600 font-bold">{payment.price} BDT</td>
                                        <td className="font-mono text-xs">{payment.transactionId}</td>
                                        <td>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'} {payment.date && new Date(payment.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                        <td>
                                            <span className="badge badge-ghost badge-sm">{payment.type || 'Subscription'}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-400">
                                        No payments found regardless of filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
