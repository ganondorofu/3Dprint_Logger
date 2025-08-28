import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export interface PrintLog {
  id: string;
  purpose: string;
  printer: 'left' | 'right';
  startTime: Timestamp;
  endTime: Timestamp;
  studentId: string;
  userName: string;
  createdAt: Timestamp;
}

export const logSchema = z.object({
  purpose: z.string().min(3, { message: 'Purpose must be at least 3 characters long.' }).max(500),
  printer: z.enum(['left', 'right'], { required_error: 'Please select a printer.' }),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid start date and time.' }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid end date and time.' }),
  studentId: z.string().min(1, { message: 'Student ID is required.' }),
  userName: z.string().min(1, { message: 'User name is required.' }),
}).refine(data => new Date(data.startTime) < new Date(data.endTime), {
  message: "End time must be after start time.",
  path: ["endTime"],
});

export type LogSchema = z.infer<typeof logSchema>;
