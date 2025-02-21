import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { processMeeting, MeetingData, MeetingResults } from '@/lib/api';
import toast from 'react-hot-toast';

export function useMeeting() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [participants, setParticipants] = useState([{ name: '', position: '' }]);
  const [results, setResults] = useState<MeetingResults | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: MeetingData) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('title', data.title);
      formData.append('context', data.context);
      formData.append('participants', JSON.stringify(data.participants));

      // If this is a large file, add the Supabase reference
      if ('supabaseRef' in data.file) {
        formData.append('supabaseRef', (data.file as any).supabaseRef);
      }

      return processMeeting(formData);
    },
    onSuccess: (data) => {
      setResults(data);
      toast.success('Meeting processed successfully');
    },
    onError: (error) => {
      toast.error('Failed to process meeting');
      console.error('Processing error:', error);
    },
  });

  const processMeetingData = () => {
    if (!file || !title || !context || !participants.length) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data: MeetingData = {
      file,
      title,
      context,
      participants: participants.filter((p) => p.name && p.position),
    };

    mutation.mutate(data);
  };

  return {
    file,
    setFile,
    title,
    setTitle,
    context,
    setContext,
    participants,
    setParticipants,
    results,
    isProcessing: mutation.isPending,
    processMeetingData,
  };
} 
