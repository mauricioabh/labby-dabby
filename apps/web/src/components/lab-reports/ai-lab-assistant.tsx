'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { analyzePastedLabText } from '@/actions/lab-reports';

export function AILabAssistant() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    summary: string;
    detailed: string;
    suggestedQuestions: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    const res = await analyzePastedLabText(text);
    setLoading(false);
    if ('error' in res) {
      setError(res.error.message);
    } else {
      setResult(res.data);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-lg">
      <div className="flex items-center gap-sm">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">AI Lab Report Assistant</h3>
      </div>
      <p className="mt-sm text-sm text-muted-foreground">
        Paste your lab values and get a patient-friendly explanation powered by
        Gemini.
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your lab results here, e.g.: Hemoglobin: 11.2 g/dL (13.0 - 17.0) WBC: 12.5 x10^9/L (4.0 - 11.0)..."
        rows={6}
        className="mt-lg"
        disabled={loading}
      />
      <div className="mt-md flex justify-end">
        <Button onClick={handleAnalyze} disabled={loading || !text.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-sm h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-sm h-4 w-4" />
              Analyze with Gemini
            </>
          )}
        </Button>
      </div>
      {error && <p className="mt-md text-sm text-destructive">{error}</p>}
      {result && (
        <div className="mt-xl space-y-lg border-t border-border pt-lg">
          <div>
            <h4 className="font-medium text-foreground">Summary</h4>
            <p className="mt-sm text-muted-foreground">{result.summary}</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground">Detailed analysis</h4>
            <div className="mt-sm whitespace-pre-wrap text-muted-foreground">
              {result.detailed}
            </div>
          </div>
          {result.suggestedQuestions.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground">
                Questions for your clinician
              </h4>
              <ul className="mt-sm list-inside list-disc space-y-xs text-muted-foreground">
                {result.suggestedQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            This explanation is for informational purposes only. Always consult
            your doctor for medical decisions.
          </p>
        </div>
      )}
    </div>
  );
}
