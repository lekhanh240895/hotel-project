'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';
import { ResultCode } from '@/app/lib/utils';
import User from '@/app/lib/models/User';
import { mongooseConnect } from '@/app/lib/mongoose';

export async function getUser(email: string) {
  await mongooseConnect();

  const user = await User.findOne({ email });
  return user;
}

interface Result {
  type: string;
  resultCode: ResultCode;
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6)
      })
      .safeParse({
        email,
        password
      });

    if (parsedCredentials.success) {
      await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn
      };
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      };
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
          };
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError
          };
      }
    }
  }
}