'use server';

import { signOut } from '@/auth/auth';

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
