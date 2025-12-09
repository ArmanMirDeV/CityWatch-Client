import React from 'react';
import { FaPhoneAlt, FaFireExtinguisher, FaAmbulance, FaShieldAlt } from 'react-icons/fa';

const EmergencyContacts = () => {
    const services = [
        {
            id: 1,
            name: "National Emergency",
            number: "999",
            icon: <FaPhoneAlt />,
            color: "bg-red-600",
            desc: "Police, Ambulance, Fire"
        },
        {
            id: 2,
            name: "Police Control",
            number: "100",
            icon: <FaShieldAlt />,
            color: "bg-blue-600",
            desc: "Law Enforcement"
        },
        {
            id: 3,
            name: "Fire Service",
            number: "102",
            icon: <FaFireExtinguisher />,
            color: "bg-orange-600",
            desc: "Fire & Rescue"
        },
        {
            id: 4,
            name: "Ambulance",
            number: "101",
            icon: <FaAmbulance />,
            color: "bg-green-600",
            desc: "Medical Emergency"
        }
    ];

    return (
        <div className="bg-base-200 py-16">
             <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-blue-800 uppercase mb-2">Emergency Contacts</h2>
                    <p className="text-gray-600">Quick access to essential emergency services in your area.</p>
                    <div className="w-24 h-1 bg-red-500 mx-auto mt-4 rounded"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map(service => (
                        <div key={service.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-full h-1 ${service.color}`}></div>
                            <div className={`w-16 h-16 rounded-full ${service.color} text-white flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
                            <p className="text-gray-500 text-sm mb-6">{service.desc}</p>
                            
                            <a href={`tel:${service.number}`} className={`btn btn-outline w-full gap-2 hover:text-white ${service.color.replace('bg-', 'hover:bg-').replace('bg-', 'text-')}`}>
                                <FaPhoneAlt /> Call {service.number}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmergencyContacts;
