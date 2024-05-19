import React, { useState } from 'react';

interface CreateSlotData {
  startTime: string;
  endTime: string;
}

interface ConsultationFormProps {
  onSubmit: (slotData: CreateSlotData) => void;
  isLoading: boolean;
  error: string | null;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slotData: CreateSlotData = {
      startTime,
      endTime,
    };
    onSubmit(slotData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="startTime" className="block font-bold mb-2">
          Start Time
        </label>
        <input
          type="datetime-local"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endTime" className="block font-bold mb-2">
          End Time
        </label>
        <input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-3"
          required
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating...' : 'Create Slot'}
      </button>
    </form>
  );
};