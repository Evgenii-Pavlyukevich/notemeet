import { useState } from 'react';
import { translations } from '@/lib/translations';

interface Participant {
  name: string;
  position: string;
}

interface MeetingFormProps {
  title: string;
  context: string;
  participants: Participant[];
  onTitleChange: (title: string) => void;
  onContextChange: (context: string) => void;
  onParticipantsChange: (participants: Participant[]) => void;
  onSubmit: () => void;
  isProcessing: boolean;
}

export function MeetingForm({
  title,
  context,
  participants,
  onTitleChange,
  onContextChange,
  onParticipantsChange,
  onSubmit,
  isProcessing,
}: MeetingFormProps) {
  const addParticipant = () => {
    onParticipantsChange([...participants, { name: '', position: '' }]);
  };

  const updateParticipant = (index: number, field: keyof Participant, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    onParticipantsChange(newParticipants);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          {translations.meetingForm.title}
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="context" className="block text-sm font-medium text-gray-700">
          {translations.meetingForm.context}
        </label>
        <textarea
          id="context"
          rows={3}
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{translations.meetingForm.participants.title}</h3>
          <button
            type="button"
            onClick={addParticipant}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {translations.meetingForm.participants.addParticipant}
          </button>
        </div>

        {participants.map((participant, index) => (
          <div key={index} className="flex gap-4">
            <input
              type="text"
              placeholder={translations.meetingForm.participants.name}
              value={participant.name}
              onChange={(e) => updateParticipant(index, 'name', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder={translations.meetingForm.participants.position}
              value={participant.position}
              onChange={(e) => updateParticipant(index, 'position', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isProcessing
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? translations.meetingForm.submit.processing : translations.meetingForm.submit.process}
      </button>
    </form>
  );
} 