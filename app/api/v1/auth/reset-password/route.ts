import { mongooseConnect } from '@/app/lib/mongoose';
import User from '@/app/lib/models/User';
import { headers } from 'next/headers';
import initTranslations from '@/app/i18n';
import * as yup from 'yup';
import { ApiError, handleError } from '@/app/lib/exceptions';
import { loginSchema } from '@/app/lib/yup-schema';
import { generateResetPasswordToken } from '@/app/lib/tokens';
import ResetPasswordToken from '@/app/lib/models/ResetPasswordToken';

export async function POST(req: Request) {
  await mongooseConnect();
  const res = await req.json();

  const { email, password } = res;
  const lang = headers().get('Accept-Language') || 'en';
  const { t } = await initTranslations(lang, ['common']);

  try {
    await loginSchema(t).validate(
      {
        email,
        password
      },
      {
        abortEarly: false
      }
    );
  } catch (error: any) {
    if (error instanceof yup.ValidationError) {
      const apiError = ApiError.fromYupError(error, 'LO-0001');
      return handleError(apiError, 400);
    } else {
      const apiError = ApiError.fromUnexpected();
      return handleError(apiError, 500);
    }
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = ApiError.fromInvalidEmailPassword();
    return handleError(error, 400);
  }

  const reset_password_token = generateResetPasswordToken(user.id);

  await ResetPasswordToken.create({
    user: user.id,
    reset_password_token
  });

  return Response.json({
    status_code: 200,
    message: 'Success'
  });
}
