import { NextResponse } from 'next/server';
import { validateFile, generateResponse } from '@/lib/server.utils';
import { getLargeFile, cleanupExpiredFiles } from '@/lib/supabase';

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
    let file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const context = formData.get('context') as string;
    const participantsStr = formData.get('participants') as string;
    const supabaseRef = formData.get('supabaseRef') as string;

    if (!file || !title || !context || !participantsStr) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If this is a large file, get it from Supabase
    if (supabaseRef) {
      const largeFile = await getLargeFile(supabaseRef);
      if (!largeFile) {
        return NextResponse.json(
          { error: 'Large file not found or expired' },
          { status: 404 }
        );
      }
      file = new File([largeFile], file.name, { type: file.type });
    }

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      return validationError;
    }

    const participants = JSON.parse(participantsStr);
    const result = await generateResponse(file, title, context, participants);

    // Clean up expired files in the background
    cleanupExpiredFiles().catch(console.error);

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
