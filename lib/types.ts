import * as z from 'zod';

export const participantSchema = z.object({
  name: z.string(),
  position: z.string(),
});

export const taskSchema = z.object({
  text: z.string(),
  assignee: participantSchema.optional(),
});

export const meetingAnalysisSchema = z.object({
  summary: z.string(),
  decisions: z.array(z.string()),
  actionItems: z.array(taskSchema),
  followUps: z.array(z.string()),
  deadlines: z.array(z.string()),
});

export const meetingResultSchema = meetingAnalysisSchema.extend({
  transcription: z.string(),
});

export type MeetingAnalysis = z.infer<typeof meetingAnalysisSchema>;
export type MeetingResult = z.infer<typeof meetingResultSchema>;
export type Task = z.infer<typeof taskSchema>; 