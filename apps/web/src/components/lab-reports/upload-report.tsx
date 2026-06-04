'use client';

import { useRef, useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { useUser } from '@clerk/nextjs';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { processLabReportUpload } from '@/actions/lab-reports';
export function UploadReport() {
  const { user } = useUser();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing('labReportPdf', {
    onClientUploadComplete: async (res: { url: string; name: string }[] | undefined) => {
      if (!res?.[0]) return;
      setProcessing(true);
      setError(null);
      const result = await processLabReportUpload(
        res[0].url,
        res[0].name,
        user?.primaryEmailAddress?.emailAddress
      );
      setProcessing(false);
      if ('error' in result) {
        setError(result.error.message);
      } else {
        window.location.href = `/lab-reports/${result.data.id}`;
      }
    },
    onUploadError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleClick = () => inputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) startUpload(Array.from(files));
    e.target.value = '';
  };

  const busy = isUploading || processing;

  return (
    <div className="space-y-md">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        onClick={handleClick}
        disabled={busy}
        className="gap-sm"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {processing ? 'Analyzing...' : 'Uploading...'}
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Report
          </>
        )}
      </Button>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
