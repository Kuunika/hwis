// app/actions/logClientError.ts
'use server';

import logger from '@/lib/logger';

export async function logClientError(error: {
  message: string;
  stack?: string;
  info?: any;
}) {
  logger.error({
    source: 'client',
    ...error,
  });
}
