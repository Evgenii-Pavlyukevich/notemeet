'use client';

import { translations } from '@/lib/translations';
import { FileUpload } from '@/components/FileUpload';
import { MeetingForm } from '@/components/MeetingForm';
import { Results } from '@/components/Results';
import { useMeeting } from '@/hooks/useMeeting';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-bg-color">
        <div className="max-w-5xl mx-auto px-4 py-8 md:px-8 md:py-12">
          <div className="notion-block mb-8">
            <h1 className="text-text-primary">{translations.title}</h1>
          </div>
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