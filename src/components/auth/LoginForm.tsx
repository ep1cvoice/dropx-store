'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import Input from '@/components/ui/Input';
import { anton, inter } from '@/lib/fonts';
import { loginSchema, type LoginFormValues } from '@/lib/validation';
import { useState } from 'react';

type LoginFormProps = {
  showSubtitle?: boolean;
  emailPlaceholder?: string;
  compact?: boolean;
  className?: string;
};

export default function LoginForm({
  showSubtitle = false,
  emailPlaceholder = "you@example.com",
  compact = false,
  className = '',
}: LoginFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const timer = setTimeout(() => clearErrors(), 5000);
    return () => clearTimeout(timer);
  }, [errors, clearErrors]);

  async function onSubmit(data: LoginFormValues) {
    setServerError(null);
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: '/',
    });

    if (!result || result.error) {
      setServerError('Invalid email or password.');
      return;
    }

    router.push(result.url ?? '/');
    router.refresh();
  }

  return (
    <div className={className}>
      <FullScreenLoader show={isSubmitting} label="Signing in..." />

      <h2
        className={`${anton.className} text-2xl uppercase tracking-wide text-gray-900 md:text-3xl ${compact ? 'lg:text-3xl' : 'lg:text-4xl'}`}
      >
        Sign in
      </h2>
      {showSubtitle && (
        <p className={`${inter.className} mt-2 hidden text-sm text-gray-500 md:block`}>
          Welcome back. Sign in to access your account.
        </p>
      )}
      {status === 'authenticated' && (
        <p className={`${inter.className} mt-2 text-sm text-green-700`}>
          Signed in as {session?.user?.email ?? 'user'}.
        </p>
      )}

      <form
        className={`mt-6 space-y-4 md:mt-8 md:space-y-5 ${compact ? 'lg:mt-5 lg:space-y-3.5' : 'lg:mt-10'}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          id='email'
          label='Email'
          type='email'
          autoComplete='email'
          placeholder={emailPlaceholder}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id='password'
          label='Password'
          type='password'
          autoComplete='current-password'
          placeholder='••••••••'
          error={errors.password?.message}
          {...register('password')}
        />

        <div className='flex items-center justify-between gap-4'>
          <label className={`${inter.className} flex cursor-pointer items-center gap-2.5 text-sm text-gray-500`}>
            <input
              type='checkbox'
              name='remember'
              defaultChecked
              className='size-4 rounded-none border-gray-300 accent-gray-900'
            />
            Remember me
          </label>

          <Link href='/forgot-password' className='font-medium text-[#e85d2a] cursor-pointer'>
            <span className={`${inter.className} shrink-0 text-sm text-[#e85d2a]`}>Forgot password?</span>
          </Link>
        </div>

        <Button
          type='submit'
          variant='accent'
          disabled={isSubmitting}
          className='mt-2 w-full cursor-pointer py-3.5 text-sm uppercase tracking-wide'
        >
          Sign in
        </Button>
        {serverError && (
          <p role='alert' className={`${inter.className} text-sm text-red-500`}>
            {serverError}
          </p>
        )}
      </form>

      <div className={`relative ${compact ? 'my-5 lg:my-4' : 'my-8'}`}>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gray-200' />
        </div>
        <div className='relative flex justify-center'>
          <span className={`${inter.className} bg-white px-3 text-xs uppercase tracking-wider text-gray-400`}>Or</span>
        </div>
      </div>

      <p
        className={`${inter.className} pt-6 text-center text-sm text-gray-500 md:pt-0 ${compact ? 'lg:pt-4' : 'mt-auto md:mt-10'}`}
      >
        Don&apos;t have an account?{' '}
        <Link href='/register' className='font-medium text-[#e85d2a]'>
          Sign up
        </Link>
      </p>
    </div>
  );
}
