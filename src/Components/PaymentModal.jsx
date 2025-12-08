import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';

// Initialize Stripe outside component to avoid recreating it
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const CheckoutForm = ({ issueId, refetch, onClose, userEmail }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosPublic = useAxiosPublic();
    const [clientSecret, setClientSecret] = useState('');
    const [cardError, setCardError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Create PaymentIntent when component mounts
        axiosPublic.post('/create-payment-intent', { price: 100 })
            .then(res => {
                setClientSecret(res.data.clientSecret);
            })
            .catch(err => {
                console.error("Error creating payment intent:", err);
                Swal.fire('Error', 'Could not initialize payment.', 'error');
            });
    }, [axiosPublic]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card == null) {
            return;
        }

        setProcessing(true);
        setCardError('');

        // 1. Create Payment Method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('[error]', error);
            setCardError(error.message);
            setProcessing(false);
            return;
        }

        // 2. Confirm Payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    email: userEmail || 'anonymous@example.com',
                    name: userEmail || 'Anonymous',
                },
            },
        });

        if (confirmError) {
             console.log('[confirmError]', confirmError);
             setCardError(confirmError.message);
             setProcessing(false);
        } else {
             if (paymentIntent.status === 'succeeded') {
                 // 3. Save to DB (Boost Priority)
                 
                 // Optional: Save transaction record to /payments collection first if needed, 
                 // but requirement just says "Boost issue... tracking record added to issue timeline".
                 // The backend /issues/boost/:id handles the timeline.
                 // We might want to post to /payments as well for record keeping (as per user "tracking record is added...").
                 // The user prompt says "A tracking record is added to the issue timeline".
                 // Existing backend code /issues/boost/:id adds to timeline.
                 
                 const paymentInfo = {
                     email: userEmail,
                     price: 100,
                     transactionId: paymentIntent.id,
                     date: new Date(),
                     issueId: issueId,
                     status: 'service pending'
                 }

                 try {
                     // Save payment info
                     await axiosPublic.post('/payments', paymentInfo);
                     
                     // Perform Boost
                     const res = await axiosPublic.patch(`/issues/boost/${issueId}`, { userEmail });
                     
                     if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful',
                            text: `Transaction ID: ${paymentIntent.id}. Issue boosted to High Priority!`,
                        });
                        refetch();
                        onClose();
                     } else {
                         Swal.fire('Warning', 'Payment received but boost status might not be updated. Please contact support.', 'warning');
                     }
                 } catch (err) {
                     console.error(err);
                     Swal.fire('Error', 'Something went wrong after payment.', 'error');
                 }
             }
             setProcessing(false);
        }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="alert alert-info shadow-sm mb-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              Cost: <strong>100 BDT</strong> for High Priority Boost
            </span>
          </div>
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Card Details</span>
          </label>
          <div className="border border-base-300 p-4 rounded-lg bg-base-100">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
        </div>

        {cardError && <p className="text-red-500 text-sm mt-2">{cardError}</p>}

        <div className="modal-action flex justify-between items-center mt-8">
          <button
            type="button"
            className="btn btn-ghost text-gray-500"
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-8"
            disabled={!stripe || !clientSecret || processing}
          >
            {processing ? (
              <span className="loading  loading-spinner loading-sm"></span>
            ) : (
              <span className='text-black'>Pay 100 BDT & Boost</span>
            )}
          </button>
        </div>
      </form>
    );
};

const PaymentModal = ({ issueId, refetch, userEmail, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
             <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 border border-gray-100">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Boost Issue Priority</h3>
                
                <Elements stripe={stripePromise}>
                    <CheckoutForm issueId={issueId} refetch={refetch} userEmail={userEmail} onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
};

export default PaymentModal;
