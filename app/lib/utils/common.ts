import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { get } from '../request';

// export async function myFetch<Type = any>(
//   input: RequestInfo | URL,
//   options?: RequestInit
// ) {
//   const res = await fetch(input, options);
//   if (!res.ok) {
//     throw new ResponseError('Bad fetch response', res);
//   }
//   return (await res.json()) as Type;
// }

// export async function handleError(err: unknown) {
//   if (err instanceof ResponseError) {
//     switch (err.response.status) {
//       case 401:
//         // Prompt the user to log back in
//         // showUnauthorizedDialog();
//         console.log('Unauthorized!');
//         break;
//       case 404:
//         console.log('Not found!');
//         break;
//       case 500:
//         // Show user a dialog to apologize that we had an error and to
//         // try again and if that doesn't work contact support
//         // showErrorDialog();
//         console.log('500 error');
//         break;
//       default:
//         // Show
//         throw new Error('Unhandled fetch response', { cause: err });
//     }
//   }
//   throw new Error('Unknown fetch error', { cause: err });
// }

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

export function generateConditions(queryObject: Record<string, any>) {
  // Initialize an array to store conditions
  let conditions = [];

  // Check if queryObject has 'query' key
  if (queryObject.hasOwnProperty('query')) {
    const queryValue = queryObject['query'];

    const regEx = new RegExp(queryValue.normalize('NFC'), 'i');
    // Add condition for english_name
    conditions.push({ english_name: regEx });

    // Add condition for vietnamese_name

    conditions.push({ vietnamese_name: regEx });
    // Remove 'query' key from queryObject to avoid duplicate conditions
    delete queryObject['query'];
  }

  delete queryObject['limit'];
  delete queryObject['offset'];

  // Map all remaining entries in queryObject to conditions
  conditions = [
    ...conditions,
    ...Object.entries(queryObject).map(([key, value]) => ({ [key]: value }))
  ];

  return conditions;
}