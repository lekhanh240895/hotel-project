import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { get } from './request';
import { ResponseError } from './exceptions';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCoordinates = async (location: string) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`;
  const res = await get(url, {
    params: {
      access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      proximity: '105.83197966918473,21.026037129152332',
      country: 'vn'
    }
  });
  return res;
};

export async function myFetch<Type = any>(
  input: RequestInfo | URL,
  options?: RequestInit
) {
  const res = await fetch(input, options);
  if (!res.ok) {
    throw new ResponseError('Bad fetch response', res);
  }
  return (await res.json()) as Type;
}

export async function handleError(err: unknown) {
  if (err instanceof ResponseError) {
    switch (err.response.status) {
      case 401:
        // Prompt the user to log back in
        // showUnauthorizedDialog();
        console.log('Unauthorized!');
        break;
      case 404:
        console.log('Not found!');
        break;
      case 500:
        // Show user a dialog to apologize that we had an error and to
        // try again and if that doesn't work contact support
        // showErrorDialog();
        console.log('500 error');
        break;
      default:
        // Show
        throw new Error('Unhandled fetch response', { cause: err });
    }
  }
  throw new Error('Unknown fetch error', { cause: err });
}
