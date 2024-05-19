'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { api } from '../../../utils/api';
import Link from 'next/link';

interface Consultation {
  id: number;
  status: string;
  scheduledAt: string | null;
  waitingListPosition: number | null;
  slot: {
    id: number;
    startTime: string;
    endTime: string;
  };
  adExpert: AdExpert;
}

interface AdExpert {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  profilePicture: string | null;
  tenantId: number | null;
}

interface ConsultationSlot {
  id: number;
  startTime: string;
  endTime: string;
  consultations: Consultation[];
  adExpert: AdExpert;
}

interface BookingResponse {
  status: string;
  scheduledAt: string;
  client: Client;
  adExpert: AdExpert;
  slot: ConsultationSlot;
  waitingListPosition: number;
  id: number;
}

const BookConsultationPage: React.FC = () => {
  const [consultationSlots, setConsultationSlots] = useState<ConsultationSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(null);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
  const [bookedConsultations, setBookedConsultations] = useState<Consultation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const accessToken = Cookies.get('access_token');
        const response = await api.get('/consultation/clientslots', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setConsultationSlots(response.data);

        const bookedResponse = await api.get('/consultation/booked', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        setBookedConsultations(bookedResponse.data);

        const user = sessionStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          if (parsedUser.role !== 'client') {
            // Redirect to the home page if the user is not a client
            router.push('/dashboard');
          }
        } else {
          // Redirect to the login page if not logged in
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching consultations:', error);
      }
    };

    fetchConsultations();
  }, [router]);

  const handleSelectSlot = (slot: ConsultationSlot) => {
    setSelectedSlot(slot);
    setBookingResponse(null); // Reset the booking response when selecting a new slot
  };

  const handleBookConsultation = async () => {
    if (selectedSlot) {
      try {
        const accessToken = Cookies.get('access_token');
        const user = sessionStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          const payload = {
            adExpertId: selectedSlot.adExpert.id,
            slotId: selectedSlot.id,
          };
          const response = await api.post('/consultation/book', payload, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          setBookingResponse(response.data);
        } else {
          // Redirect to the login page if not logged in
          router.push('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409 && error.response.data.error === 'Conflict') {
            // Handle the conflict error specifically
            alert(error.response.data.message);
          } else {
            // Handle other errors
            alert('An error occurred while booking the consultation. Please try again later.');
          }
        } else {
          // Handle other errors
          alert('An error occurred while booking the consultation. Please try again later.');
        }
        console.error('Error booking consultation:', error);
      }
    }
  };

  const getConsultationStatus = (slotId: number) => {
    const consultation = bookedConsultations.find((c) => c.slot.id === slotId);
    if (consultation) {
      if (consultation.status === 'waiting') {
        return { bgColor: 'bg-yellow-100', label: 'Waiting' };
      } else if (consultation.status === 'booked') {
        return { bgColor: 'bg-green-100', label: 'Booked' };
      }
    }
    return { bgColor: 'bg-white', label: '' };
  };

  const getConsultant = (slotId: number) => {
    const consultation = bookedConsultations.find((c) => c.slot.id === slotId);
    if (consultation) {
      return consultation.adExpert.firstName + ' ' + consultation.adExpert.lastName;
    }
    return { };
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  const cancelConsultation = async (consultationId: number) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this consultation?');
  
    if (confirmCancel) {
      try {
        const accessToken = Cookies.get('access_token');
        const response = await api.put(`/consultation/cancel/${consultationId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
  
        if (response.status === 200) {
          // Consultation canceled successfully
          alert('Consultation canceled successfully');
          setBookedConsultations(bookedConsultations.filter((c) => c.id !== consultationId));
        } else if (response.data === null) {
          // Handle the case when the server responds with null
          alert('An error occurred while canceling the consultation. Please try again later.');
        } else {
          // Handle other responses
          alert('An error occurred while canceling the consultation: ' + (response.data?.message || 'Unknown error'));
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 400) {
            // Handle the "Only booked consultations can be cancelled" error
            alert(error.response.data.message);
          } else {
            // Handle other errors
            alert('An error occurred while canceling the consultation. Please try again later.');
          }
        } else {
          // Handle other errors
          alert('An error occurred while canceling the consultation. Please try again later.');
        }
        console.error('Error canceling consultation:', error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Book a Consultation</h1>
          <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            Go Back to Dashboard
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consultationSlots.map(slot => {
            const { bgColor, label } = getConsultationStatus(slot.id);
            return (
              <div
                key={slot.id}
                className={`p-4 rounded-lg shadow-md cursor-pointer ${
                  selectedSlot?.id === slot.id ? 'bg-blue-100' : bgColor
                }`}
                onClick={() => handleSelectSlot(slot)}
              >
                <h2 className="text-lg font-bold">
                  {slot.adExpert.firstName} {slot.adExpert.lastName}
                </h2>
                <p className="text-gray-600">
                  {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                </p>
                <p className="text-gray-600">Consultations: {slot.consultations.length}</p>
                {label && <span className="text-sm font-bold">{label}</span>}
              </div>
            );
          })}
        </div>
        {selectedSlot && (
          <div className="mt-8">
            <h2 className="text-xl font-bold">Selected Slot</h2>
            <p>
              {selectedSlot.adExpert.firstName} {selectedSlot.adExpert.lastName}
            </p>
            <p>
              {formatDateTime(selectedSlot.startTime)} - {formatDateTime(selectedSlot.endTime)}
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mt-4"
              onClick={handleBookConsultation}
            >
              Book Consultation
            </button>
          </div>
        )}
        {bookingResponse && (
          <div className="mt-8 bg-green-100 p-4 rounded-md">
            <h2 className="text-xl font-bold text-green-700">Consultation Booked Successfully</h2>
            <p>
              Your consultation with {bookingResponse.adExpert.firstName} {bookingResponse.adExpert.lastName} is scheduled on{' '}
              {formatDateTime(bookingResponse.scheduledAt)}.
            </p>
            <p>
              {bookingResponse.status === 'waiting'
                ? `You are on the waiting list at position ${bookingResponse.waitingListPosition}.`
                : 'Your consultation is confirmed.'}
            </p>
          </div>
        )}
        <div className="mt-8">
  <h2 className="text-xl font-bold mb-4">Booked Consultations</h2>
  {bookedConsultations.map(consultation => ( 
    <div key={consultation.id} className="bg-gray-100 p-4 rounded-md mb-2 flex justify-between items-center">
      <div>
        <p>
          Consultation with {consultation.slot.adExpert.firstName + ' ' + consultation.slot.adExpert.lastName}
        </p>
        <p>
          {formatDateTime(consultation.slot.startTime)} - {formatDateTime(consultation.slot.endTime)}
        </p>
        <p>Status: {consultation.status}</p>
      </div>
      <div className="flex gap-2">
        {(consultation.status === 'booked' || consultation.status === 'waiting') && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={() => cancelConsultation(consultation.id)}
          >
            Cancel 
          </button>
        )}
        {consultation.status === 'booked'  && (
          <Link
            href={`/feedback/${consultation.slot.adExpert.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Give Feedback
          </Link>
        )}
        {consultation.status === 'waiting'  && (
          <Link
            href={`/feedback/${consultation.slot.adExpert.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            See Feedback
          </Link>
        )}
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );

}
export default BookConsultationPage;