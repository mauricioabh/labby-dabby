import { Resend } from 'resend';
import { env } from '@/env';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function sendLabReportEmail(
  to: string,
  reportSummary: string,
  reportId: string
): Promise<{ success: boolean; error?: string }> {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Labby-dabby <onboarding@resend.dev>',
      to,
      subject: 'Your lab report analysis is ready',
      html: `
        <h1>Your lab report analysis is ready</h1>
        <p>Here's a summary of your analysis:</p>
        <p>${reportSummary}</p>
        <p><a href="${appUrl}/lab-reports/${reportId}">View full analysis</a></p>
        <p>— Labby-dabby</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('sendLabReportEmail', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send email',
    };
  }
}
