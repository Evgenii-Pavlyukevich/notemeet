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
    <div className="form-container">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="form-section">
          <label htmlFor="title" className="form-label">
            {translations.meetingForm.title}
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-section">
          <label htmlFor="context" className="form-label">
            {translations.meetingForm.context}
          </label>
          <textarea
            id="context"
            rows={3}
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            className="form-input"
            required
          />
          <p className="example-text">
            Пример: Компания с 30 сотрудниками помогает любителям кошек лучше ухаживать за их питомцами благодаря умным роботам, которые развлекают и кормят кошку, когда хозяина нет дома.
          </p>
        </div>

        <div className="form-section">
          <label className="form-label">
            {translations.meetingForm.participants.title}
          </label>
          <div className="space-y-4">
            {participants.map((participant, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  placeholder={translations.meetingForm.participants.name}
                  value={participant.name}
                  onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  placeholder={translations.meetingForm.participants.position}
                  value={participant.position}
                  onChange={(e) => updateParticipant(index, 'position', e.target.value)}
                  className="form-input"
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addParticipant}
            className="text-sm text-blue-600 hover:text-blue-500 mt-2"
          >
            {translations.meetingForm.participants.addParticipant}
          </button>
          <p className="example-text">
            Пример: Иванов Иван Иванович - фронтенд разработчик, Петров Петр Петрович - бизнес аналитик.
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="submit-button"
        >
          {isProcessing ? translations.meetingForm.submit.processing : translations.meetingForm.submit.process}
        </button>
      </form>
    </div>
  );
} 