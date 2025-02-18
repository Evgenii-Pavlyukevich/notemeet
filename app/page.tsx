'use client';

import { translations } from '@/lib/translations';
import { FileUpload } from '@/components/FileUpload';
import { MeetingForm } from '@/components/MeetingForm';
import { Results } from '@/components/Results';
import { useMeeting } from '@/hooks/useMeeting';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from '@/components/Header';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-8 pt-24">
          <h1>Автоматизация, расшифровка, обобщение и постановка задач из видео-конференций</h1>
          <p className="text-center mb-8">
            Прикрепите файл видео-конференции и нажмите "Обработать".<br />
            Через пару минут Вы получите:
          </p>
          <ul className="list-disc pl-8 mb-8 space-y-2">
            <li>текстовую расшифровку;</li>
            <li>тезисное резюме с содержательными выжимками основных моментов;</li>
            <li>таймкоды основных моментов;</li>
            <li>список задач, поставленных каждому из присутствующих на встрече сотрудников.</li>
          </ul>
          <MeetingProcessor />
        </div>
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