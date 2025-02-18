import 'server-only';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { VALID_MIME_TYPES, MAX_FILE_SIZE, MOCK_TRANSCRIPTION, MOCK_ANALYSIS } from './constants';
import { meetingAnalysisSchema } from './types';
import { Transcription } from 'openai/resources/audio/transcriptions.mjs';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
});

const metadataModel = openai('gpt-4-1106-preview');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const validateFile = (file: File) => {
  if (!file) {
    return new NextResponse('No file provided', { status: 400 });
  }

  if (!VALID_MIME_TYPES.includes(file.type)) {
    return new NextResponse('Unsupported file type', { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return new NextResponse('File size exceeds 25MB limit', { status: 400 });
  }
};

const transcribeAudio = async (file: File): Promise<Transcription> => {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('DEBUG MODE IS ON');
    return new Promise((res) =>
      setTimeout(() => res({ text: MOCK_TRANSCRIPTION } as Transcription), 1000)
    );
  }

  const response = await client.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
    response_format: 'srt',
  });

  return response;
};

const analyzeMeeting = async (
  transcription: Transcription,
  title: string,
  context: string,
  participants: { name: string; position: string }[]
) => {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('DEBUG MODE IS ON');
    return new Promise((res) => setTimeout(() => res(MOCK_ANALYSIS), 1000));
  }

  const analysisPrompt = `
    Meeting Title: ${title}
    Business Context: ${context}
    Participants: ${participants.map((p) => `${p.name} (${p.position})`).join(', ')}
    
    Transcription: ${
      typeof transcription === 'string' ? transcription : transcription.text
    }
    
    Please analyze this meeting and provide:
    1. A brief summary
    2. Key decisions made
    3. Action items with assigned responsibilities
    4. Follow-up tasks
    5. Important deadlines mentioned
  `;

  const { object } = await generateObject({
    model: metadataModel,
    schema: meetingAnalysisSchema,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: analysisPrompt,
          },
        ],
      },
    ],
  });

  return object;
};

export const generateResponse = async (
  file: File,
  title: string,
  context: string,
  participants: { name: string; position: string }[]
) => {
  const transcribedAudio = await transcribeAudio(file);
  console.log('🚀 ~ generateResponse ~ transcribedAudio:', transcribedAudio);

  const analysis = await analyzeMeeting(transcribedAudio, title, context, participants);
  console.log('🚀 ~ generateResponse ~ analysis:', analysis);

  return {
    transcription: typeof transcribedAudio === 'string' ? transcribedAudio : transcribedAudio.text,
    ...analysis,
  };
}; 