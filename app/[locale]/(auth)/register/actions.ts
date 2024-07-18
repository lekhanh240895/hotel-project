'use server';

import { signIn } from '@/auth';
import { ResultCode } from '@/app/lib/utils';
import { z } from 'zod';
import { getUser } from '../login/actions';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import User from '@/app/lib/models/User';

export async function createUser(email: string, hashedPassword: string) {
  const existingUser = await getUser(email);

  if (existingUser) {
    return {
      type: 'error',
      resultCode: ResultCode.UserAlreadyExists
    };
  } else {
    const user = {
      email,
      password: hashedPassword
    };

    await User.create(user);

    return {
      type: 'success',
      resultCode: ResultCode.UserCreated
    };
  }
}

interface Result {
  type: string;
  resultCode: ResultCode;
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

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
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const result = await createUser(email, hashPassword);

      if (result.resultCode === ResultCode.UserCreated) {
        await signIn('credentials', {
          email,
          password,
          redirect: false
        });
      }

      return result;
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
      } else {
        return {
          type: 'error',
          resultCode: ResultCode.UnknownError
        };
      }
    }
  } else {
    return {
      type: 'error',
      resultCode: ResultCode.InvalidCredentials
    };
  }
}
