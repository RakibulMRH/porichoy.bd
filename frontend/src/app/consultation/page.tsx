'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ConsultationList } from '../../components/Consultation/ConsultationList';
import { api } from '../../utils/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Consultation {
  id: number;
  status: string;
  scheduledAt: string | null;
  waitingListPosition: number | null;
}

interface AdExpert {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}

interface ConsultationSlot {
  id: number;
  startTime: string;
  endTime: string;
  consultations: Consultation[];
  adExpert: AdExpert;
}

const ConsultationPage: React.FC = () => {
  const [consultationSlots, setConsultationSlots] = useState<ConsultationSlot[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        const response = await api.get('/consultation/slot', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setConsultationSlots(response.data);

        const user = sessionStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          if (parsedUser.role !== 'adExpert') {
            // Redirect to the consultation/booked page if the user is not an adExpert
            router.push('/consultation/booked');
          }
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
      }
    };

    fetchConsultations();
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Consultations</h1>
          <Link
            href="/consultation/upcoming"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            See Upcoming Consultations
          </Link>
        </div>
        <ConsultationList consultationSlots={consultationSlots} />
        <div className="mt-8 flex flex-col space-y-4">
          <Link
            href="/consultation/create-slot"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-center"
          >
            Create slot
          </Link>
          <Link
            href="/consultation/cancel"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-center"
          >
            Cancel slot
          </Link>
          <Link
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-center"
          >
            Go Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;