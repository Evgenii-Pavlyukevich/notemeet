import { NextResponse } from 'next/server';
import { validateFile, generateResponse } from '@/lib/server.utils';

export const maxDuration = 60; // Reduced from 300 to 60 seconds

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
    const validationError = validateFile(file);
    if (validationError) {
      return validationError;
    }

    const participants = JSON.parse(participantsStr);
    const result = await generateResponse(file, title, context, participants);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Processing error:', error);
    
    // Specific error handling for timeouts
    if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Request timed out. Please try with a shorter audio file.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process meeting recording' },
      { status: 500 }
    );
  }
} 