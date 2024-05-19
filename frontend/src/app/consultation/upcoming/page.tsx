'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../../utils/api';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface Consultation {
  id: number;
  status: string;
  scheduledAt: string | null;
  waitingListPosition: number | null;
  client: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  slot: {
    id: number;
    startTime: string;
    endTime: string;
  };
}

const UpcomingConsultationsPage: React.FC = () => {
  const [upcomingConsultations, setUpcomingConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    const fetchUpcomingConsultations = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        const response = await api.get('/consultation/upcoming', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setUpcomingConsultations(response.data);
      } catch (error) {
        console.error('Error fetching upcoming consultations:', error);
      }
    };

    fetchUpcomingConsultations();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Upcoming Consultations</h1>
          <Link href="/consultation" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Back to Consultations
          </Link>
        </div>
        {upcomingConsultations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingConsultations.map((consultation) => (
              <div key={consultation.id} className="bg-gray-100 p-4 rounded-md">
                <p className="font-bold">Client: {consultation.client.firstName} {consultation.client.lastName}</p>
                <p>Status: {consultation.status}</p>
                <p>Scheduled At: {consultation.scheduledAt || 'Not scheduled yet'}</p>
                <p>Waiting List Position: {consultation.waitingListPosition || 'N/A'}</p>
                <p>
                  Slot: {new Date(consultation.slot.startTime).toLocaleString()} - {new Date(consultation.slot.endTime).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No upcoming consultations found.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingConsultationsPage;