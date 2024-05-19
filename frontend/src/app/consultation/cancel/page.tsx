'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { CancelConsultationForm } from '../../../components/Consultation/CancelConsultationForm';
import { api } from '../../../utils/api';
import Cookies from 'js-cookie';
import { access } from 'fs';
import Link from 'next/link'; 

const CancelConsultationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleCancelConsultation = async (consultationId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const accessToken = Cookies.get('access_token');
      const response = await api.delete(`/consultation/cancel/${consultationId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      console.log('Consultation cancelled successfully:', response.data);
      setSuccess(true);
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      setError('Failed to cancel consultation');
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Cancel Consultation</h1>
      <CancelConsultationForm
        onSubmit={handleCancelConsultation}
        isLoading={isLoading}
        error={error}
        success={success}
      /><br></br>
      <Link href="/dashboard" className="text-blue-500 hover:text-blue-700">
              Go Back to Dashboard
            </Link>
    </div>
  );
};

export default CancelConsultationPage;