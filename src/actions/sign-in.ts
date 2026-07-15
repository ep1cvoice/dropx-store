'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth/auth';
import { loginSchema, type LoginFormValues } from '@/lib/validation';

export async function signInAction(
  data: LoginFormValues,
): Promise<{ error: string } | void> {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid form data.' };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { error: 'Invalid email or password.' };
      }

      return { error: 'Unable to sign in right now. Please try again.' };
    }

    throw error;
  }
}
