import 'server-only';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { VALID_MIME_TYPES, MAX_FILE_SIZE, MOCK_TRANSCRIPTION, MOCK_ANALYSIS } from './constants';
import { meetingAnalysisSchema, MeetingAnalysis, MeetingResult, Task } from './types';

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

const transcribeAudio = async (file: File): Promise<{ text: string }> => {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('DEBUG MODE IS ON');
    return new Promise((res) =>
      setTimeout(() => res({ text: MOCK_TRANSCRIPTION }), 1000)
    );
  }

  try {
    const response = await client.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      response_format: 'srt',
    }) as string;

    return { text: response };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

const analyzeMeeting = async (
  transcription: { text: string },
  title: string,
  context: string,
  participants: { name: string; position: string }[]
): Promise<MeetingAnalysis> => {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log('DEBUG MODE IS ON');
    return new Promise((res) => setTimeout(() => res(MOCK_ANALYSIS as MeetingAnalysis), 1000));
  }

  try {
    const analysisPrompt = `
      Meeting Title: ${title}
      Business Context: ${context}
      Participants: ${participants.map((p) => `${p.name} (${p.position})`).join(', ')}
      
      Transcription: ${transcription.text}
      
      Please analyze this meeting and provide:
      1. A brief summary
      2. Key decisions made
      3. Action items with assigned responsibilities (make sure to assign each action item to a specific participant)
      4. Follow-up tasks
      5. Important deadlines mentioned

      For action items, please assign them to specific participants based on their roles and the context of the discussion.
      Each action item should include the task description and the assigned participant's name and position.
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

    return object as MeetingAnalysis;
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze meeting');
  }
};

export const generateResponse = async (
  file: File,
  title: string,
  context: string,
  participants: { name: string; position: string }[]
): Promise<MeetingResult> => {
  try {
    const transcribedAudio = await transcribeAudio(file);
    console.log('🚀 ~ generateResponse ~ transcribedAudio:', transcribedAudio);

    const analysis: MeetingAnalysis = await analyzeMeeting(transcribedAudio, title, context, participants);
    console.log('🚀 ~ generateResponse ~ analysis:', analysis);

    return {
      transcription: transcribedAudio.text,
      summary: analysis.summary,
      decisions: analysis.decisions,
      actionItems: analysis.actionItems,
      followUps: analysis.followUps,
      deadlines: analysis.deadlines,
    };
  } catch (error) {
    console.error('Response generation error:', error);
    throw error;
  }
}; 
