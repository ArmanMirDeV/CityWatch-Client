import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import { FaUsers, FaClipboardCheck, FaCheckDouble } from 'react-icons/fa';
import CountUp from 'react-countup';

const StatsSection = () => {
    const axiosPublic = useAxiosPublic();

    const { data: stats = {} } = useQuery({
        queryKey: ['public-stats'],
        queryFn: async () => {
            const res = await axiosPublic.get('/public-stats');
            return res.data;
        }
    });

    return (
        <div className="py-16  text-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl text-blue-900 font-extrabold uppercase mb-2">Our Impact</h2>
                    <p className="max-w-2xl mx-auto">See how CityWatch is making a difference in your community through active citizen participation.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-transform duration-300">
                        <div className="inline-flex p-4 rounded-full bg-blue-500/30 mb-4 text-4xl">
                            <FaUsers />
                        </div>
                        <h3 className="text-5xl font-bold mb-2">
                             <CountUp end={stats.totalUsers || 0} duration={2.5} />
                        </h3>
                        <p className="text-lg font-medium ">Active Citizens</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-transform duration-300">
                         <div className="inline-flex p-4 rounded-full bg-yellow-500/30 mb-4 text-4xl">
                            <FaClipboardCheck />
                        </div>
                        <h3 className="text-5xl font-bold mb-2">
                            <CountUp end={stats.totalIssues || 0} duration={2.5} />
                        </h3>
                        <p className="text-lg font-medium ">Issues Reported</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-transform duration-300">
                         <div className="inline-flex p-4 rounded-full bg-green-500/30 mb-4 text-4xl">
                            <FaCheckDouble />
                        </div>
                        <h3 className="text-5xl font-bold mb-2">
                            <CountUp end={stats.resolvedIssues || 0} duration={2.5} />
                        </h3>
                        <p className="text-lg font-medium ">Issues Resolved</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
