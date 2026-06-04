'use client';

import { useState, useRef } from 'react';
import { useUploadThing } from '@/lib/uploadthing';
import { useUser } from '@clerk/nextjs';
import { Upload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { processLabReportUpload } from '@/actions/lab-reports';

interface UploadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadReportModal({ open, onOpenChange }: UploadReportModalProps) {
  const { user } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { startUpload, isUploading } = useUploadThing('labReportPdf', {
    onClientUploadComplete: async (res) => {
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
        onOpenChange(false);
        window.location.href = `/lab-reports/${result.data.id}`;
      }
    },
    onUploadError: (err) => {
      setError(err.message);
    },
  });

  const handleFiles = (files: FileList | null) => {
    if (files?.length) {
      const pdf = Array.from(files).find((f) => f.type === 'application/pdf');
      if (pdf) startUpload([pdf]);
    }
  };

  const busy = isUploading || processing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Lab Report</DialogTitle>
          <DialogDescription>
            Upload a PDF of your lab test results. We&apos;ll extract the content
            and provide AI-powered analysis.
          </DialogDescription>
        </DialogHeader>
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-xl py-2xl transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          } ${busy ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="mt-md text-center text-sm text-muted-foreground">
            {busy
              ? processing
                ? 'Analyzing...'
                : 'Uploading...'
              : 'Drag and drop your lab report PDF here, or click to browse'}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-md"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
          >
            Select PDF File
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled className="opacity-50">
            {busy ? (
              <>
                <Loader2 className="mr-sm h-4 w-4 animate-spin" />
                {processing ? 'Analyzing...' : 'Uploading...'}
              </>
            ) : (
              'Upload & Analyze'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
