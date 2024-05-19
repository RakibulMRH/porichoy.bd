'use client';
import React, { useState } from 'react'; 
import Cookies from 'js-cookie';
import { api } from '../../../utils/api';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [response, setResponse] = useState(null);

  const router = useRouter();

  const handleConfirmPayment = async () => {
    const cookieValue = Cookies.get('subscription');
    const accessToken = Cookies.get('access_token');

    Cookies.remove('subscription');
    setIsLoading(true);

    try {
      const response = await api.post(
        `subscriptions/${cookieValue}`,
        {
          paymentMethod: 'credit_card',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setResponse(response.data);
 
      if (response.status === 201) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        window.alert('Unexpected response status:'+ (response as any).status);
      }
    } catch (error) {
        window.alert("You have already subscribed to this plan. Please go to back to dashboard to view your subscription.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {isSuccess ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
            <p className="mb-4">Thank you for your purchase. Redirecting to the dashboard...</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Confirm Payment</h2>
            <button
              onClick={handleConfirmPayment}
              disabled={isLoading}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Confirm Payment'}
            </button>
            <br></br>
            <button 
            onClick={ router.back }
              className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Go back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;