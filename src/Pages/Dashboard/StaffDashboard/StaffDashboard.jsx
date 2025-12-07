import React from 'react';
import { NavLink, Outlet } from 'react-router';
import { FaHome, FaTasks, FaClipboardList, FaBars } from 'react-icons/fa';
import useAuth from '../../../Hooks/useAuth';

const StaffDashboard = () => {
    const { user } = useAuth();
    
    return (
        <div className="drawer lg:drawer-open">
            <input id="staff-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-4">
                {/* Page content here */}
                <label htmlFor="staff-drawer" className="btn btn-primary text-black drawer-button lg:hidden mb-4 w-fit">
                    <FaBars /> Open Menu
                </label>
                <Outlet />
            </div>
            <div className="drawer-side z-40">
                <label htmlFor="staff-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col">
                    {/* Sidebar content here */}
                    <div className="mb-6 flex flex-col items-center">
                         <div className="avatar placeholder mb-2">
                             <div className="bg-primary text-primary-content rounded-full w-16">
                                <span className="text-xl font-bold">{<img src={user.photoURL} alt="" /> }</span>
                             </div>
                         </div>
                         <h2 className="text-xl font-bold">Staff Dashboard</h2>
                         <p className="text-sm opacity-70">Welcome, {user?.displayName}</p>
                    </div>

                    <li><NavLink to="/dashboard/staff" end><FaHome /> Overview</NavLink></li>
                    <li><NavLink to="/dashboard/staff/assigned-issues"><FaTasks /> Assigned Issues</NavLink></li>
                    <li><NavLink to="/dashboard/staff/profile"><FaTasks /> Edit Profile</NavLink></li>
                    
                    <div className="divider"></div>
                    <li><NavLink to="/"><FaHome /> Home</NavLink></li>
                </ul>
            </div>
        </div>
    );
};

export default StaffDashboard;
