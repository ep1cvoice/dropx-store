'use server';

import { signOut } from '@/auth/auth';

export async function signOutAction(): Promise<never> {
  await signOut({ redirectTo: '/' });
}
