import { logClientError } from '@/app/actions/log-client-error';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await logClientError(body);
    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to log client error' },
      { status: 500 }
    );
  }
}
