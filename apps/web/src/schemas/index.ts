import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string().max(50)).optional().default([]),
});

export const updateNoteSchema = createNoteSchema.partial();

export const createShareSchema = z.object({
  labReportId: z.string().uuid(),
  recipientEmail: z.string().email().optional(),
  expiresInDays: z.number().min(1).max(365).optional().default(7),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  labReportId: z.string().uuid().optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type CreateShareInput = z.infer<typeof createShareSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
