'use server';

import { revalidatePath } from 'next/cache';
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PrintLog, LogSchema } from '@/lib/types';
import { logSchema } from '@/lib/types';

export async function addPrintLog(data: LogSchema) {
  const validatedFields = logSchema.safeParse(data);

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data provided.' };
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
    return { success: true, message: 'Log added successfully.' };
  } catch (error) {
    return { success: false, error: 'Failed to add log to the database.' };
  }
}

export async function getPrintLogs(): Promise<{ logs: PrintLog[] | null; error: string | null; }> {
  try {
    // A check to ensure a project ID is configured before querying
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !db.app.options.projectId?.includes("your-project-id")) {
       console.warn("Firebase project ID is not configured. Skipping Firestore query.");
       return { logs: [], error: "Firebase is not configured. Please check your setup." };
    }

    const q = query(collection(db, 'printLogs'), orderBy('startTime', 'desc'));
    const querySnapshot = await getDocs(q);
    const logs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as PrintLog[];
    return { logs, error: null };
  } catch (error) {
    console.error("Error fetching print logs:", error);
    return { logs: null, error: 'Failed to fetch print logs from the database.' };
  }
}
