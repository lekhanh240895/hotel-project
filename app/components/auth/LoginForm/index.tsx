'use client';

import { Trans, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Link from 'next/link';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { InputLabel } from '../../InputLabel';
import { Button } from '../../ui/button';
import { toast } from 'react-toastify';
import { useFormState, useFormStatus } from 'react-dom';
import { getMessageFromCode } from '@/app/lib/utils';
import { authenticate } from '@/app/[locale]/(auth)/login/actions';
import { LoadingIcon } from '../../LoadingIcon';
import { useRouter, useSearchParams } from 'next/navigation';

export type LoginFormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const router = useRouter();
  const [result, dispatch] = useFormState(authenticate, undefined);
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  console.log({result})

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode));
      } else {
        toast.success(getMessageFromCode(result.resultCode), {
          className: 'bg-green-500',
          autoClose: 1000
        });
        router.push(callbackUrl ? callbackUrl : LIST_ROUTER.DASHBOARD);
        router.refresh();
      }
    }
  }, [callbackUrl, result, router]);

  return (
    <>
      <form action={dispatch}>
        <div className="flex flex-col flex-wrap gap-5 p-4">
          <InputLabel
            label={t('email_field').toUpperCase()}
            name="email"
            type="email"
            defaultValue="admin@gmail.com"
          />

          <InputLabel
            label={t('password_field').toUpperCase()}
            type="password"
            name="password"
            defaultValue="Admin123"
          />

          <Link
            className="self-end font-semibold text-blue-700"
            href={LIST_ROUTER.FORGOT_PASSWORD}
          >
            Forgot password?
          </Link>

          <div className="mt-5 flex justify-center">
            <LoginButton />
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

function LoginButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <Button
      className="w-full"
      variant={'default'}
      type="submit"
      size={'lg'}
      disabled={pending}
    >
      {pending && <LoadingIcon />}
      {t('login:login_title')}
    </Button>
  );
}
