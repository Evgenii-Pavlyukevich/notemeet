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
    <div className="notion-card p-6">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
        <div className="notion-block">
          <label htmlFor="title" className="block text-sm mb-2">
            {translations.meetingForm.title}
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="notion-input"
            required
          />
        </div>

        <div className="notion-block">
          <label htmlFor="context" className="block text-sm mb-2">
            {translations.meetingForm.context}
          </label>
          <textarea
            id="context"
            rows={3}
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            className="notion-input"
            required
          />
        </div>

        <div className="notion-block">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">{translations.meetingForm.participants.title}</h3>
            <button
              type="button"
              onClick={addParticipant}
              className="notion-button text-sm"
            >
              {translations.meetingForm.participants.addParticipant}
            </button>
          </div>

          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  placeholder={translations.meetingForm.participants.name}
                  value={participant.name}
                  onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                  className="notion-input"
                  required
                />
                <input
                  type="text"
                  placeholder={translations.meetingForm.participants.position}
                  value={participant.position}
                  onChange={(e) => updateParticipant(index, 'position', e.target.value)}
                  className="notion-input"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`notion-button w-full ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isProcessing ? translations.meetingForm.submit.processing : translations.meetingForm.submit.process}
        </button>
      </form>
    </div>
  );
} 