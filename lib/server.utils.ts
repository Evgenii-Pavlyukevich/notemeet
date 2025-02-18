import 'server-only';
import OpenAI from 'openai';

const VALID_MIME_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'video/mp4', 'video/webm'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const validateFile = (file: File) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!VALID_MIME_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 25MB limit');
  }
};

export const transcribeAudio = async (file: File) => {
  const transcriptionResponse = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
  });

  return transcriptionResponse.text;
};

export const analyzeMeeting = async (
  transcription: string,
  title: string,
  context: string,
  participants: { name: string; position: string }[]
) => {
  const analysisPrompt = `
    Meeting Title: ${title}
    Business Context: ${context}
    Participants: ${participants.map((p) => `${p.name} (${p.position})`).join(', ')}
    
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

  return JSON.parse(content);
}; 