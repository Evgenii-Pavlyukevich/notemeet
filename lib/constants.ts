export const VALID_MIME_TYPES = [
  'audio/mpeg', // mp3
  'video/mp4', // mp4
  'audio/mp4', // m4a
  'video/mpeg', // mpeg
  'audio/mpeg', // mpga
  'audio/wav', // wav
  'audio/webm', // webm (audio)
  'video/webm', // webm (video)
  'audio/x-m4a',
];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB in bytes

export const MOCK_TRANSCRIPTION = `00:00:00,000 --> 00:00:05,000
Hello everyone, welcome to our weekly meeting.

00:00:05,000 --> 00:00:10,000
Today we'll discuss the project timeline and next steps.`;

export const MOCK_ANALYSIS = {
  summary: 'Weekly meeting discussing project timeline and next steps.',
  decisions: ['Proceed with the current plan'],
  actionItems: [
    {
      text: 'Review timeline',
      assignee: {
        name: 'John Doe',
        position: 'Project Manager'
      }
    },
    {
      text: 'Prepare documentation',
      assignee: {
        name: 'Jane Smith',
        position: 'Technical Writer'
      }
    }
  ],
  followUps: ['Schedule follow-up meeting next week'],
  deadlines: ['Documentation due by end of week'],
}; 
