import React from 'react';

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
  // Other AdExpert properties
}

interface ConsultationSlot {
  id: number;
  startTime: string;
  endTime: string;
  consultations: Consultation[];
  adExpert: AdExpert;
}

interface ConsultationListProps {
  consultationSlots: ConsultationSlot[];
}

export const ConsultationList: React.FC<ConsultationListProps> = ({ consultationSlots }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {consultationSlots.map((slot) => (
        <div key={slot.id} className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold">
            Slot: {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
          </h3>
          <p className="text-gray-600">Ad Expert: {`${slot.adExpert.firstName} ${slot.adExpert.lastName}`}</p>
          <div className="mt-4">
            {slot.consultations.length > 0 ? (
              <ul>
                {slot.consultations.map((consultation) => (
                  <li key={consultation.id} className="flex items-center justify-between">
                    <span>
                      Consultation ID: {consultation.id}{' '}
                      {consultation.status === 'booked' && (
                        <span className="text-green-500">(Booked at {new Date(consultation.scheduledAt!).toLocaleString()})</span>
                      )}
                      {consultation.status === 'waiting' && (
                        <span className="text-yellow-500">(Waiting List Position: {consultation.waitingListPosition})</span>
                      )}
                      {consultation.status === 'cancelled' && <span className="text-red-500">(Cancelled)</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No consultations for this slot</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};