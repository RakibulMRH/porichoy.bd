'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { GiDiamondHard } from 'react-icons/gi';
import { FaStar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';
import { api } from '@/utils/api';

interface SubscriptionPlan {
  id: number;
  name: string;
  domain: string;
  subscriptionPlan: string;
  costPerSecond: string;
}

const SubscriptionPage = () => {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [response, setResponse] = useState('');
  const [user, setUserSession] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      const accessToken = Cookies.get('access_token');
      const user = sessionStorage.getItem('user');
      setUserSession(JSON.parse(user as string));
      const response = await api.get('/users', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      setResponse(response.data);

      if (!(response.status === 200)) {
        throw new Error('Failed to fetch subscription plans');
      }

      const data: SubscriptionPlan[] = response.data;
      setSubscriptionPlans(data);
    };

    fetchSubscriptionPlans();
  }, []);

  const diamondPlans = subscriptionPlans.filter(plan => plan.subscriptionPlan === '1' || plan.name.includes('_diamond'));
  const proPlans = subscriptionPlans.filter(plan => plan.subscriptionPlan === '2' || plan.name.includes('_pro'));

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-indigo-900 flex items-center">
            <GiDiamondHard className="text-yellow-400 mr-2" />
            Diamond Subscription Plans
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {diamondPlans.map(plan => (
              <div key={plan.name} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-3 py-4">
                  <h3 className="text-base font-bold text-indigo-900">{plan.name.replace('_diamond', '').replace('_', ' ')}</h3>
                  <p className="mt-1 text-xs text-gray-600">{plan.domain.includes('_2x') ? `${plan.domain.replace('_2x', '')} (2X Coverage)` : plan.domain}</p>
                  <p className="mt-2 text-lg font-bold text-indigo-900 flex items-center">
                    <GiDiamondHard className="text-yellow-400 mr-1" />
                    {parseFloat(plan.costPerSecond) / 100} ৳/second
                  </p>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>✓ 2x ad campaigns</p>
                    <p>✓ Basic analytics</p>
                    <p>✓ Email support</p>
                    <p>✓ Priority support</p>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <button className="w-full bg-indigo-600 border border-transparent rounded-md py-1.5 px-3 flex items-center justify-center text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    Cookies.set('subscription', `${(user as any).id}/${plan.id}/${plan.subscriptionPlan}`, { expires: 1 });
                    router.push('/subscriptions/confirm');
                  }}>
                    Buy at {parseFloat(plan.costPerSecond)} ৳/week
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-indigo-900 flex items-center">
            <FaStar className="text-yellow-400 mr-2" />
            Pro Subscription Plans
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
            {proPlans.map(plan => (
              <div key={plan.name} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-3 py-4">
                  <h3 className="text-base font-bold text-indigo-900">{plan.name.replace('_pro', '').replace('_', ' ')}</h3>
                  <p className="mt-1 text-xs text-gray-600">{plan.domain.includes('_2x') ? `${plan.domain.replace('_2x', '')} (2X Coverage)` : plan.domain}</p>
                  <p className="mt-2 text-lg font-bold text-indigo-900 flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    {parseFloat(plan.costPerSecond) / 100} ৳/second
                  </p>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>✓ Limited ad campaigns</p>
                    <p>✓ Basic analytics</p>
                    <p>✓ Email support</p>
                    <p>✓ Priority support</p>
                  </div>
                </div>
                <div className="px-3 py-2">
                  <button className="w-full bg-indigo-600 border border-transparent rounded-md py-1.5 px-3 flex items-center justify-center text-xs font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    Cookies.set('subscription', `${(user as any).id}/${plan.id}/${plan.subscriptionPlan}`, { expires: 1 });
                    router.push('/subscriptions/confirm');
                  }}>
                    Buy at {parseFloat(plan.costPerSecond)} ৳/week
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;