import { COOKIE_CONFIG, STORAGE_KEYS } from '@/app/lib/constants/common';
import { ApiError, handleError } from '@/app/lib/exceptions';
import AvailableToken from '@/app/lib/models/AvailableToken';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
} from '@/app/lib/tokens';
import { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const res = await req.json();
  const { refresh_token } = res;

  if (!refresh_token) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }

  const decoded = verifyToken(refresh_token, 'refresh') as JwtPayload;
  if (!decoded) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }
  const userId = decoded.userId;

  const token = await AvailableToken.findOne({ refresh_token });

  if (!token) {
    const error = ApiError.fromUnauthorized();
    return handleError(error, 401);
  }

  try {
    const deletedToken = await AvailableToken.findOneAndDelete({
      $and: [
        {
          user: userId
        },
        {
          refresh_token: refresh_token
        }
      ]
    });

    if (!deletedToken) {
      cookies().set(STORAGE_KEYS.ACCESS_TOKEN, '', {
        ...COOKIE_CONFIG,
        maxAge: 0
      });
      cookies().set(STORAGE_KEYS.REFRESH_TOKEN, '', {
        ...COOKIE_CONFIG,
        maxAge: 0
      });
      cookies().delete(STORAGE_KEYS.IS_AUTHENTICATED);
    }

    const access_token = generateAccessToken(userId);
    const new_refresh_token = generateRefreshToken(userId);

    await AvailableToken.create({
      user: userId,
      refresh_token: new_refresh_token
    });

    cookies().set({
      name: STORAGE_KEYS.ACCESS_TOKEN,
      value: access_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.REFRESH_TOKEN,
      value: refresh_token,
      ...COOKIE_CONFIG
    });
    cookies().set({
      name: STORAGE_KEYS.IS_AUTHENTICATED,
      value: 'true'
    });

    return Response.json({
      status_code: 201,
      message: 'Success',
      data: {
        access_token,
        refresh_token: new_refresh_token
      }
    });
  } catch (error: any) {
    return Response.json({});
  }
}
