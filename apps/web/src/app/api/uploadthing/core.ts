import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server';
import { ensureUserInDatabase } from '@/lib/ensure-user-in-db';

const f = createUploadthing();

export const uploadthingRouter = {
  labReportPdf: f({ pdf: { maxFileSize: '8MB' } })
    .middleware(async () => {
      const { userId } = await auth();
      if (!userId) throw new Error('Unauthorized');
      await ensureUserInDatabase();
      return { userId };
    })
    .onUploadComplete(async () => {
      // Client polls for completion; we process via Server Action after upload
      return {};
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadthingRouter;
