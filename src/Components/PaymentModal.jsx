import React, { useState } from 'react';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const PaymentModal = ({ issueId, refetch, userEmail, isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulating Payment Delay
        setTimeout(async () => {
             try {
                // Perform Boost Action
                const res = await axiosPublic.patch(`/issues/boost/${issueId}`, { userEmail });
                
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Payment Successful',
                        text: 'Issue boosted to High Priority!',
                    });
                    refetch();
                    onClose();
                } else {
                     Swal.fire({
                        icon: 'error',
                        title: 'Boost Failed',
                        text: res.data.message || 'Already boosted or error occurred.',
                    });
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Error',
                    text: error.response?.data?.message || 'Something went wrong.',
                });
            } finally {
                setLoading(false);
            }
        }, 1500); // 1.5s simulated delay
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all scale-100">
                <h3 className="text-2xl font-bold text-center mb-6 text-primary">Boost Issue Priority</h3>
                
                <div className="alert alert-info shadow-sm mb-6">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Cost: <strong>100 BDT</strong></span>
                    </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Card Number (Test)</span>
                        </label>
                        <input type="text" placeholder="1234 5678 9101 1121" className="input input-bordered w-full" required />
                    </div>
                    <div className="flex gap-4">
                         <div className="form-control w-1/2">
                            <label className="label">
                                <span className="label-text">Expiry</span>
                            </label>
                            <input type="text" placeholder="MM/YY" className="input input-bordered w-full" required />
                        </div>
                         <div className="form-control w-1/2">
                            <label className="label">
                                <span className="label-text">CVC</span>
                            </label>
                            <input type="text" placeholder="123" className="input input-bordered w-full" required />
                        </div>
                    </div>

                    <div className="modal-action justify-between mt-8">
                        <button type="button" className="btn btn-ghost text-gray-500" onClick={onClose} disabled={loading}>Cancel</button>
                        <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                            {loading ? 'Processing...' : 'Pay & Boost'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
