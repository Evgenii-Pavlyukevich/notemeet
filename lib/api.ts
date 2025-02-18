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

  try {
    const response = await axios.post<MeetingResults>('/api/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    });

    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
      throw new Error('Request timed out. The file might be too large or the server is busy. Please try again.');
    }
    throw error;
  }
} 