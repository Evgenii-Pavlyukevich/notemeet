import { useState } from 'react';
import { translations } from '@/lib/translations';
import styled from 'styled-components';

interface Participant {
  name: string;
  position: string;
}

const FormContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const FormTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const ParticipantsSection = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const ParticipantsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ParticipantCard = styled.div`
  display: flex;
  gap: 0.75rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const AddParticipantButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #000;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background: transparent;
  width: 100%;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #000;
    background: rgba(0, 0, 0, 0.02);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ExampleText = styled.p`
  font-size: 0.75rem;
  color: var(--placeholder-color);
  font-style: italic;
  margin-top: 0.75rem;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

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
    <FormContainer>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <FormSection>
          <FormLabel htmlFor="title">
            {translations.meetingForm.title}
          </FormLabel>
          <FormInput
            type="text"
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </FormSection>

        <FormSection>
          <FormLabel htmlFor="context">
            {translations.meetingForm.context}
          </FormLabel>
          <FormTextArea
            id="context"
            value={context}
            onChange={(e) => onContextChange(e.target.value)}
            required
          />
          <ExampleText>
            Пример: Компания с 30 сотрудниками помогает любителям кошек лучше ухаживать за их питомцами благодаря умным роботам, которые развлекают и кормят кошку, когда хозяина нет дома.
          </ExampleText>
        </FormSection>

        <FormSection>
          <FormLabel>
            {translations.meetingForm.participants.title}
          </FormLabel>
          <ParticipantsSection>
            <ParticipantsList>
              {participants.map((participant, index) => (
                <ParticipantCard key={index}>
                  <FormInput
                    type="text"
                    placeholder={translations.meetingForm.participants.name}
                    value={participant.name}
                    onChange={(e) => updateParticipant(index, 'name', e.target.value)}
                    required
                  />
                  <FormInput
                    type="text"
                    placeholder={translations.meetingForm.participants.position}
                    value={participant.position}
                    onChange={(e) => updateParticipant(index, 'position', e.target.value)}
                    required
                  />
                </ParticipantCard>
              ))}
            </ParticipantsList>
            <AddParticipantButton
              type="button"
              onClick={addParticipant}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {translations.meetingForm.participants.addParticipant}
            </AddParticipantButton>
            <ExampleText>
              Пример: Иванов Иван Иванович - фронтенд разработчик, Петров Петр Петрович - бизнес аналитик.
            </ExampleText>
          </ParticipantsSection>
        </FormSection>

        <SubmitButton
          type="submit"
          disabled={isProcessing}
        >
          {isProcessing ? translations.meetingForm.submit.processing : translations.meetingForm.submit.process}
        </SubmitButton>
      </form>
    </FormContainer>
  );
} 