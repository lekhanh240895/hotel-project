'use client';

import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema } from '@/app/lib/yup-schema';
import { useConfirmRedirectIfDirty } from '@/app/lib/hooks/useConfirmRedirectIfDirty';
import Link from 'next/link';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { InputLabel } from '../../InputLabel';
import { Button } from '../../ui/button';
import { login } from '@/app/lib/actions';
import { toast } from 'react-toastify';

export type LoginFormData = {
  email: string;
  password: string;
};

function LoginForm() {
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
    resolver: yupResolver(loginSchema(t)),
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'Admin123'
    }
  });

  useConfirmRedirectIfDirty(isDirty);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const res = await login(data);

      if (res.error) {
        return setError(res.error.message);
      }

      toast.success(t('login:login_success'), {
        className: 'bg-green-500',
        autoClose: 1000
      });
      router.push(callbackUrl ? callbackUrl : LIST_ROUTER.DASHBOARD);

      router.refresh();
    } catch (error: any) {
      console.log({ error });
    }
  };

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
            name="email"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={t('email_field').toUpperCase()}
                error={errors?.email}
                value={value}
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={t('password_field').toUpperCase()}
                error={errors?.password}
                value={value}
                onChange={onChange}
                type="password"
              />
            )}
          />

          <Link
            className="self-end font-semibold text-blue-700"
            href={LIST_ROUTER.FORGOT_PASSWORD}
          >
            Forgot password?
          </Link>

          <div className="mt-5 flex justify-center">
            <Button
              className="w-full"
              variant={'default'}
              type="submit"
              size={'lg'}
              disabled={isSubmitting}
            >
              {t('login:login_title')}
            </Button>
          </div>
        </div>
      </form>

      <p className="mt-4 text-center font-semibold">
        <Trans i18nKey="login:sign_up_link">
          Don&apos;t have an account?{' '}
          <Link href={LIST_ROUTER.REGISTER} className="text-blue-700">
            Sign up here
          </Link>
        </Trans>
      </p>
    </>
  );
}

export default LoginForm;
