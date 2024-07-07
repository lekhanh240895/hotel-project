'use client';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trans, useTranslation } from 'react-i18next';
import { useState } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/app/lib/yup-schema';
import { useConfirmRedirectIfDirty } from '@/app/lib/hooks/useConfirmRedirectIfDirty';
import { InputLabel } from '../InputLabel';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LOGIN_PAGE, POLICY_PAGE, TERM_PAGE } from '@/app/lib/constants/common';

export type RegisterFormData = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms_and_policy_checked: boolean;
};

function RegisterForm() {
  const { t, i18n } = useTranslation();
  const [error, setError] = useState('');
  const router = useRouter();
  const locale = i18n.language;

  const {
    handleSubmit,
    reset,
    control,
    setError: setHookFormError,
    formState: { isSubmitting, errors, isDirty }
  } = useForm<RegisterFormData>({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      terms_and_policy_checked: false
    },
    resolver: yupResolver(registerSchema(t))
  });

  useConfirmRedirectIfDirty(isDirty);

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.terms_and_policy_checked) return;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-wrap gap-6 p-4">
          {error && (
            <div className="flex flex-wrap items-center justify-center gap-4 self-center bg-[#f92d6a0d] px-4 py-2 text-red-500">
              <XCircleIcon className="h-12 w-12 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <Controller
            control={control}
            name="full_name"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={t('name_field').toUpperCase()}
                error={errors?.full_name}
                value={value}
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={t('email_field')}
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
              />
            )}
          />

          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { value, onChange } }) => (
              <InputLabel
                label={t('confirm_password_field').toUpperCase()}
                error={errors?.confirm_password}
                value={value}
                onChange={onChange}
              />
            )}
          />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="terms_and_policy_checked"
                className="form-checkbox h-4 w-4 border-gray-300 bg-gray-100 p-1 text-blue-600 focus:ring-blue-500 "
              />
              <Label
                htmlFor="terms_and_policy_checked"
                className="order-2 mb-0 text-base text-gray-900 dark:text-white"
              >
                <Trans i18nKey="register:read_and_accept">
                  I have read and accept to{' '}
                  <Link
                    href={TERM_PAGE}
                    className="font-semibold text-blue-700"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>
                  and{' '}
                  <Link
                    href={POLICY_PAGE}
                    className="font-semibold text-blue-700"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </Trans>
              </Label>
            </div>
            <p className="text-sm text-red-500">
              {errors?.terms_and_policy_checked?.message}
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <Button variant={'default'} type="submit" disabled={isSubmitting}>
              {t('register:register_title')}
            </Button>
          </div>
        </div>
      </form>

      <p className="text-center font-semibold ">
        <Trans i18nKey="register:sign_in_link">
          Already have an account?{' '}
          <Link href={LOGIN_PAGE} className="text-blue-700">
            Sign in here
          </Link>
        </Trans>
      </p>
    </>
  );
}

export default RegisterForm;
