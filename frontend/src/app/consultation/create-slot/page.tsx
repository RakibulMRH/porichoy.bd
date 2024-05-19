'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ConsultationForm } from '../../../components/Consultation/consultationForm';
import { useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import Link from 'next/link';

interface CreateSlotData {
  startTime: string;
  endTime: string;
}

const CreateSlotPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== 'adExpert') {
        router.push('/consultation'); // Redirect to the home page if not an adExpert
      }
    } else {
      router.push('/login'); // Redirect to the login page if not logged in
    }
  }, [router]);

  const handleCreateSlot = async (slotData: CreateSlotData) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const accessToken = Cookies.get('access_token');

      const response = await api.post('/consultation/slot', slotData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.status === 201) {
        setMessage('Slot created successfully');
      }

      console.log('Slot created successfully:', response.data);
    } catch (error) {
      console.error('Error creating slot:', error);
      setError('Failed to create consultation slot');
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Create Consultation Slot</h1>
        <ConsultationForm onSubmit={handleCreateSlot} isLoading={isLoading} error={error} />
        <div className="flex justify-between mt-4">
          <Link
            href="/consultation"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Back to Consultations
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Go Back to Dashboard
          </Link>
        </div>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSlotPage;