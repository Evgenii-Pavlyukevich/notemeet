import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const context = formData.get('context') as string;
    const participants = JSON.parse(formData.get('participants') as string);

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Convert audio to text using Whisper
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: file,
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
      throw new Error('Failed to get analysis from OpenAI');
    }

    const analysis = JSON.parse(content);

    return NextResponse.json({
      transcription,
      ...analysis,
    });
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process meeting recording' },
      { status: 500 }
    );
  }
} 