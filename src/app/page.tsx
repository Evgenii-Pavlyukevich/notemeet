'use client';

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
      <main className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">VideoNotes</h1>
          <MeetingProcessor />
        </div>
        <Toaster position="bottom-right" />
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
