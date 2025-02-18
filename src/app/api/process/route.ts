import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const context = formData.get('context');
    const participantsStr = formData.get('participants');

    if (!file || !title || !context || !participantsStr) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const participants = JSON.parse(participantsStr as string);

    // Convert audio to text using Whisper
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: file as any,
      model: 'whisper-1',
    });

    const transcription = transcriptionResponse.text;

    // Analyze the transcription using GPT-4
    const analysisPrompt = `
      Meeting Title: ${title}
      Business Context: ${context}
      Participants: ${participants.map((p: any) => `${p.name} (${p.position})`).join(', ')}
      
      Transcription: ${transcription}
      
      Please analyze this meeting and provide:
      1. A brief summary
      2. Key decisions made
      3. Action items with assigned responsibilities
      4. Follow-up tasks
      5. Important deadlines mentioned
      
      Format the response as JSON with the following structure:
      {
        "summary": "...",
        "decisions": ["..."],
        "actionItems": ["..."],
        "followUps": ["..."],
        "deadlines": ["..."]
      }
    `;

    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = analysisResponse.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'Failed to get analysis from OpenAI' },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(content);

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