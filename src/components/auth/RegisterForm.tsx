'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import Input from '@/components/ui/Input';
import { anton, inter } from '@/lib/fonts';
import { registerSchema, type RegisterFormValues } from '@/lib/validation';
import { register as registerAction } from '@/actions/register';

type RegisterFormProps = {
  showSubtitle?: boolean;
  compact?: boolean;
  className?: string;
};

export default function RegisterForm({
  showSubtitle = false,
  compact = false,
  className = '',
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    const timer = setTimeout(() => clearErrors(), 5000);
    return () => clearTimeout(timer);
  }, [errors, clearErrors]);

  async function onSubmit(data: RegisterFormValues) {
    setServerError(null);
    const result = await registerAction(data);
    if (result?.error) setServerError(result.error);
  }

  return (
    <div className={className}>
      <FullScreenLoader show={isSubmitting} label="Creating account..." />

      <h2
        className={`${anton.className} text-2xl uppercase tracking-wide text-gray-900 md:text-3xl ${compact ? 'lg:text-3xl' : 'lg:text-4xl'}`}
      >
        Create account
      </h2>
      {showSubtitle && (
        <p className={`${inter.className} mt-2 hidden text-sm text-gray-500 md:block`}>
          Sign up to access exclusive drops and releases.
        </p>
      )}

      <form
        className={`mt-6 space-y-4 md:mt-8 md:space-y-5 ${compact ? 'lg:mt-5 lg:space-y-3' : 'lg:mt-10'}`}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={`grid grid-cols-2 gap-4 ${compact ? 'lg:gap-3' : ''}`}>
          <Input
            id='firstName'
            label='First Name'
            type='text'
            autoComplete='given-name'
            placeholder='First name'
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            id='lastName'
            label='Last Name'
            type='text'
            autoComplete='family-name'
            placeholder='Last name'
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input
          id='email'
          label='Email'
          type='email'
          autoComplete='email'
          placeholder='you@example.com'
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          id='password'
          label='Password'
          type='password'
          autoComplete='new-password'
          placeholder='••••••••'
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          id='confirmPassword'
          label='Confirm Password'
          type='password'
          autoComplete='new-password'
          placeholder='••••••••'
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div>
          <label className={`${inter.className} flex cursor-pointer items-start gap-2.5 text-sm text-gray-500`}>
            <input
              type='checkbox'
              className='mt-0.5 size-4 shrink-0 rounded-none border-gray-300 accent-gray-900'
              {...register('terms')}
            />
            I agree to the{" "}
            <Link
              href="/privacy"
              className="font-medium text-[#e85d2a] underline underline-offset-2"
            >
              Terms of Service and Privacy Policy
            </Link>
          </label>
          {errors.terms && (
            <p role='alert' className={`${inter.className} mt-1.5 text-xs text-red-500`}>
              {errors.terms.message}
            </p>
          )}
        </div>

        {serverError && (
          <p role='alert' className={`${inter.className} text-sm text-red-500`}>
            {serverError}
          </p>
        )}

        <Button
          type='submit'
          variant='accent'
          disabled={isSubmitting}
          className='mt-2 w-full cursor-pointer py-3.5 text-sm uppercase tracking-wide'
        >
          Create account
        </Button>
      </form>

      <p
        className={`${inter.className} pt-6 text-center text-sm text-gray-500 md:pt-0 ${compact ? 'lg:pt-4' : 'mt-auto md:mt-10'}`}
      >
        Already have an account?{' '}
        <Link href='/login' className='font-medium text-[#e85d2a]'>
          Sign in
        </Link>
      </p>
    </div>
  );
}
