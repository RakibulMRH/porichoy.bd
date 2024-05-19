import React, { useState } from 'react';

interface CancelConsultationFormProps {
  onSubmit: (consultationId: string) => void;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const CancelConsultationForm: React.FC<CancelConsultationFormProps> = ({
  onSubmit,
  isLoading,
  error,
  success,
}) => {
  const [consultationId, setConsultationId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(consultationId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="consultationId" className="block font-bold mb-2">
          Consultation ID
        </label>
        <input
          type="text"
          id="consultationId"
          value={consultationId}
          onChange={(e) => setConsultationId(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3"
          required
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Consultation cancelled successfully</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Cancelling...' : 'Cancel Consultation'}
      </button>
    </form>
  );
};