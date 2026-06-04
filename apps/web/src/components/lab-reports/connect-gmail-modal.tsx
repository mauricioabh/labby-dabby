'use client';

import { Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConnectGmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectGmailModal({ open, onOpenChange }: ConnectGmailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Lab Reports from Gmail</DialogTitle>
          <DialogDescription>
            Connect your Gmail account to automatically import lab report emails
            and attachments.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-border bg-muted/30 p-lg">
          <h3 className="font-medium">Connect Gmail Account</h3>
          <p className="mt-sm text-sm text-muted-foreground">
            Securely connect your Gmail to automatically fetch lab reports.
          </p>
          <Button className="mt-lg w-full gap-sm" disabled>
            <Mail className="h-4 w-4" />
            Connect Gmail
          </Button>
          <p className="mt-md text-xs text-muted-foreground">
            Your Gmail credentials are encrypted and stored securely. We only
            access emails related to lab reports and test results.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
