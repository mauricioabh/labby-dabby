'use client';

import { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createShare } from '@/actions/shares';

interface ShareReportButtonProps {
  reportId: string;
}

export function ShareReportButton({ reportId }: ShareReportButtonProps) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    const result = await createShare({ labReportId: reportId });
    setLoading(false);
    if ('data' in result) {
      setShareUrl(result.data.shareUrl);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (shareUrl) {
    return (
      <Button variant="outline" onClick={handleCopy} className="gap-sm">
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy link
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      disabled={loading}
      className="gap-sm"
    >
      <Share2 className="h-4 w-4" />
      {loading ? 'Creating...' : 'Share'}
    </Button>
  );
}
