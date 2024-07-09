'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema } from '@/app/lib/yup-schema';
import { useConfirmRedirectIfDirty } from '@/app/lib/hooks/useConfirmRedirectIfDirty';
import { InputLabel } from '../../InputLabel';
import { Button } from '../../ui/button';

export type LoginFormData = {
  password: string;
  confirm_password: string;
};

function ResetPasswordForm() {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const {
    handleSubmit,
    setError: setHookFormError,
    control,
    formState: { isSubmitting, errors, isDirty }
  } = useForm<LoginFormData>({
    resolver: yupResolver(resetPasswordSchema(t)),
    defaultValues: {
      password: '',
      confirm_password: ''
    }
  });

  useConfirmRedirectIfDirty(isDirty);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {};

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap gap-5 p-4">
          {error && (
            <div className="flex flex-wrap items-center justify-center gap-4 self-center bg-[#f92d6a0d] px-4 py-2 text-red-500">
              <XCircleIcon className="h-12 w-12 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={'New password'}
                error={errors?.password}
                value={value}
                onChange={onChange}
                type="password"
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={'Confirm password'}
                error={errors?.confirm_password}
                value={value}
                onChange={onChange}
                type="password"
              />
            )}
          />

          <Button size={'lg'} className="mt-4 w-full" disabled={isSubmitting}>
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}

export default ResetPasswordForm;
