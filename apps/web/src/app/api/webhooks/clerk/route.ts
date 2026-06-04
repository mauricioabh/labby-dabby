import { NextRequest } from 'next/server';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { env } from '@/env';
import { upsertAppUser } from '@/lib/upsert-app-user';

export async function POST(req: NextRequest) {
  const webhookSecret = env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not configured');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let event: { type: string; data: Record<string, unknown> };
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: webhookSecret,
    });
    event = evt as unknown as { type: string; data: Record<string, unknown> };
  } catch (err) {
    console.error('Clerk webhook verification failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = event.data as {
      id: string;
      email_addresses?: Array<{ email_address: string }>;
      first_name?: string | null;
      last_name?: string | null;
      image_url?: string;
    };

    const email = email_addresses?.[0]?.email_address ?? '';
    const name = [first_name, last_name].filter(Boolean).join(' ') || null;

    await upsertAppUser({
      id,
      email,
      name,
      imageUrl: image_url ?? null,
    });
  }

  return new Response('OK', { status: 200 });
}
