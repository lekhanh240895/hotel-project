'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/app/lib/yup-schema';
import { useConfirmRedirectIfDirty } from '@/app/lib/hooks/useConfirmRedirectIfDirty';
import { InputLabel } from '../../InputLabel';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import Link from 'next/link';
import { LIST_ROUTER } from '@/app/lib/constants/common';
import { passwordStrength } from 'check-password-strength';
import PasswordStrength from '../PasswordStrength';
import { toast } from 'react-toastify';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '@/app/[locale]/(auth)/register/actions';
import { getMessageFromCode } from '@/app/lib/utils';
import { LoadingIcon } from '../../LoadingIcon';

export type RegisterFormData = {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  terms_and_policy_checked: boolean;
};

function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [passStrength, setPassStrength] = useState(0);
  const { control } = useForm<RegisterFormData>({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      confirm_password: '',
      terms_and_policy_checked: false
    },
    resolver: yupResolver(registerSchema(t))
  });

  const email = useWatch({
    control,
    name: 'email',
    defaultValue: ''
  });

  const password = useWatch({
    control,
    name: 'password',
    defaultValue: ''
  });

  useEffect(() => {
    setPassStrength(passwordStrength(password).id);
  }, [password]);

  const [result, dispatch] = useFormState(signup, undefined);

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode));
      } else {
        toast.success(getMessageFromCode(result.resultCode));
        router.push(`${LIST_ROUTER.EMAIL_VERIFICATION}?email=${email}`);
        router.refresh();
      }
    }
  }, [email, result, router]);
  return (
    <>
      <form action={dispatch}>
        <div className="flex flex-col flex-wrap gap-5 p-4">
          <InputLabel label={t('name_field').toUpperCase()} name="full_name" />
          <InputLabel
            label={t('email_field').toUpperCase()}
            name="email"
            type="email"
          />
          <InputLabel
            label={t('password_field').toUpperCase()}
            name="password"
            type="password"
          />
          <InputLabel
            label={t('confirm_password_field').toUpperCase()}
            name="confirm_password"
            type="password"
          />

          {password && <PasswordStrength passStrength={passStrength} />}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                id="terms_and_policy_checked"
                className="form-checkbox h-4 w-4 border-gray-300 bg-gray-100 p-1 text-blue-600 focus:ring-blue-500"
              />

              <Label
                htmlFor="terms_and_policy_checked"
                className="order-2 mb-0 text-base text-gray-900 dark:text-white"
              >
                <Trans i18nKey="register:read_and_accept">
                  I have read and accept to{' '}
                  <Link
                    href={LIST_ROUTER.TERM}
                    className="font-semibold text-blue-700"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>
                  and{' '}
                  <Link
                    href={LIST_ROUTER.POLICY}
                    className="font-semibold text-blue-700"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </Trans>
              </Label>
            </div>
          </div>

          <div className="mt-5 flex justify-center">
            <SignupButton />
          </div>
        </div>
      </form>

      <p className="text-center font-semibold ">
        <Trans i18nKey="register:sign_in_link">
          Already have an account?{' '}
          <Link href={LIST_ROUTER.LOGIN} className="text-blue-700">
            Sign in here
          </Link>
        </Trans>
      </p>
    </>
  );
}

export default RegisterForm;

function SignupButton() {
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
      {t('register:register_title')}
    </Button>
  );
}
