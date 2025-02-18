import { NextResponse } from 'next/server';
import { validateFile, transcribeAudio, analyzeMeeting } from '@/lib/server.utils';

export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const context = formData.get('context') as string;
    const participantsStr = formData.get('participants') as string;

    if (!file || !title || !context || !participantsStr) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file
    try {
      validateFile(file);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Process in steps
    const transcription = await transcribeAudio(file);
    const participants = JSON.parse(participantsStr);
    const analysis = await analyzeMeeting(transcription, title, context, participants);

    return NextResponse.json({
      transcription,
      ...analysis,
    });
  } catch (error: any) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process meeting recording' },
      { status: 500 }
    );
  }
} 