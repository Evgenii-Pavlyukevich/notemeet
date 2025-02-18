import axios from 'axios';

export interface MeetingData {
  title: string;
  context: string;
  participants: { name: string; position: string }[];
  file: File;
}

export interface MeetingResults {
  transcription: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  followUps: string[];
  deadlines: string[];
}

export async function processMeeting(data: MeetingData): Promise<MeetingResults> {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('title', data.title);
  formData.append('context', data.context);
  formData.append('participants', JSON.stringify(data.participants));

  const response = await axios.post<MeetingResults>('/api/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
} 