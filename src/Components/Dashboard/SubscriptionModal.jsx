import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';

// Initialize Stripe 
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_GATEWAY_PK);

const SubscriptionCheckoutForm = ({ refetch, onClose, userEmail }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosPublic = useAxiosPublic();
    const [clientSecret, setClientSecret] = useState('');
    const [cardError, setCardError] = useState('');
    const [processing, setProcessing] = useState(false);
    const SUBSCRIPTION_PRICE = 1000;

    useEffect(() => {
        // Create PaymentIntent
        axiosPublic.post('/create-payment-intent', { price: SUBSCRIPTION_PRICE })
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
                },
            },
        });

        if (confirmError) {
             setCardError(confirmError.message);
             setProcessing(false);
        } else {
             if (paymentIntent.status === 'succeeded') {
                 
                 const paymentInfo = {
                     email: userEmail,
                     price: SUBSCRIPTION_PRICE,
                     transactionId: paymentIntent.id,
                     date: new Date(),
                     type: 'subscription',
                     status: 'paid'
                 }

                 try {
                     // Save payment info
                     await axiosPublic.post('/payments', paymentInfo);
                     
                     // Upgrade User
                     const res = await axiosPublic.patch(`/users/premium/${userEmail}`);
                     
                     if (res.data.modifiedCount > 0) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Premium Subscription Successful!',
                            text: `Transaction ID: ${paymentIntent.id}`,
                        });
                        refetch();
                        onClose();
                     }
                 } catch (err) {
                     console.error(err);
                     Swal.fire('Error', 'Payment successful but upgrade failed. Contact support.', 'error');
                 }
             }
             setProcessing(false);
        }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="alert alert-warning shadow-sm mb-4">
            <div>
                 <span>Subscribe for <strong>{SUBSCRIPTION_PRICE} BDT</strong> to unlock unlimited reports!</span>
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
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <span className='text-black'>Pay {SUBSCRIPTION_PRICE} BDT</span>
            )}
          </button>
        </div>
      </form>
    );
};

const SubscriptionModal = ({ refetch, userEmail, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
             <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all scale-100 border border-gray-100">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Get Premium Access</h3>
                
                <Elements stripe={stripePromise}>
                    <SubscriptionCheckoutForm refetch={refetch} userEmail={userEmail} onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
};

export default SubscriptionModal;
