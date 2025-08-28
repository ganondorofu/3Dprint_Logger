'use server';

import { revalidatePath } from 'next/cache';
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PrintLog, LogSchema } from '@/lib/types';
import { logSchema } from '@/lib/types';

export async function addPrintLog(data: LogSchema) {
  const validatedFields = logSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: '無効なデータです。' };
  }

  try {
    const { startTime, endTime, ...rest } = validatedFields.data;
    await addDoc(collection(db, 'printLogs'), {
      ...rest,
      startTime: Timestamp.fromDate(new Date(startTime)),
      endTime: Timestamp.fromDate(new Date(endTime)),
      createdAt: Timestamp.now(),
    });

    revalidatePath('/');
    return { success: true, message: 'ログが正常に追加されました。' };
  } catch (error) {
    return { success: false, error: 'データベースへのログの追加に失敗しました。' };
  }
}

export async function getPrintLogs(): Promise<{ logs: PrintLog[] | null; error: string | null; }> {
  try {
    const q = query(collection(db, 'printLogs'), orderBy('startTime', 'desc'));
    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PrintLog[];
    return { logs, error: null };
  } catch (error) {
    console.error("プリントログの取得中にエラーが発生しました:", error);
    return { logs: null, error: 'データベースからのプリントログの取得に失敗しました。' };
  }
}
