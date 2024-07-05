import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { get } from './request';

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
