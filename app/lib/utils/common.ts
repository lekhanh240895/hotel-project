import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { get } from '../request';

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

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages
  ];
};

export function generateConditions(
  queryObject: Record<string, any>
): Record<string, any>[] {
  const conditions: Record<string, any>[] = [];
  delete queryObject['limit'];
  delete queryObject['offset'];

  for (const [key, value] of Object.entries(queryObject)) {
    if (value) {
      conditions.push({
        [key]: new RegExp(value.normalize('NFC'), 'i')
      });
    }
  }

  return conditions;
}
