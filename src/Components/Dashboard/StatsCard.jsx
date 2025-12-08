import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, description }) => {
    return (
        <div className={`stat bg-white shadow-xl rounded-2xl border-l-4 ${color} border-gray-100`}>
            <div className={`stat-figure text-3xl ${color.replace('border-', 'text-')}`}>
                <Icon />
            </div>
            <div className="stat-title font-semibold text-gray-500">{title}</div>
            <div className={`stat-value ${color.replace('border-', 'text-')}`}>{value}</div>
            {description && <div className="stat-desc">{description}</div>}
        </div>
    );
};

export default StatsCard;
