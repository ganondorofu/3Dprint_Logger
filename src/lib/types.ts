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
  purpose: z.string().min(3, { message: '目的は3文字以上で入力してください。' }).max(500),
  printer: z.enum(['left', 'right'], { required_error: 'プリンターを選択してください。' }),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: '開始日時が無効です。' }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), { message: '終了日時が無効です。' }),
  studentId: z.string().min(1, { message: '学籍番号は必須です。' }),
  userName: z.string().min(1, { message: '利用者名は必須です。' }),
}).refine(data => new Date(data.startTime) < new Date(data.endTime), {
  message: "終了時間は開始時間より後にしてください。",
  path: ["endTime"],
});

export type LogSchema = z.infer<typeof logSchema>;
