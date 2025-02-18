'use client';

import { translations } from '@/lib/translations';
import { FileUpload } from '@/components/FileUpload';
import { MeetingForm } from '@/components/MeetingForm';
import { Results } from '@/components/Results';
import { useMeeting } from '@/hooks/useMeeting';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';
import styled from 'styled-components';

const queryClient = new QueryClient();

const MainContent = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  padding-top: 6rem;

  @media (min-width: 768px) {
    max-width: 700px;
    padding: 2rem;
    padding-top: 7rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const FeatureList = styled.ul`
  list-style-type: disc;
  padding-left: 2rem;
  margin-bottom: 2rem;
  space-y: 0.5rem;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-white">
        <Header />
        <MainContent>
          <PageTitle>
            Автоматизация, расшифровка, обобщение и постановка задач из видео-конференций
          </PageTitle>
          <Description>
            Прикрепите файл видео-конференции и нажмите "Обработать".<br />
            Через пару минут Вы получите:
          </Description>
          <FeatureList>
            <li>текстовую расшифровку;</li>
            <li>тезисное резюме с содержательными выжимками основных моментов;</li>
            <li>таймкоды основных моментов;</li>
            <li>список задач, поставленных каждому из присутствующих на встрече сотрудников.</li>
          </FeatureList>
          <MeetingProcessor />
        </MainContent>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-color)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
            },
          }}
        />
      </main>
    </QueryClientProvider>
  );
}

function MeetingProcessor() {
  const meeting = useMeeting();

  return (
    <div className="space-y-8">
      <FileUpload file={meeting.file} onFileChange={meeting.setFile} />
      <MeetingForm
        title={meeting.title}
        context={meeting.context}
        participants={meeting.participants}
        onTitleChange={meeting.setTitle}
        onContextChange={meeting.setContext}
        onParticipantsChange={meeting.setParticipants}
        onSubmit={meeting.processMeetingData}
        isProcessing={meeting.isProcessing}
      />
      {meeting.results && <Results {...meeting.results} />}
    </div>
  );
} 