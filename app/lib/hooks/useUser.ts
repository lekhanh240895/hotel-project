'use client';

import { Fetcher } from 'swr';
import ENDPOINTS from '../endpoints';
import { getMe } from '../actions';
import useSWRImmutable from 'swr/immutable';

const fetcher: Fetcher<User, string> = () => getMe().then((res) => res.data);

export const useUser = () => {
  const { data, error, isLoading } = useSWRImmutable(
    ENDPOINTS.PROFILE,
    fetcher,
    {
      revalidateOnMount: true
    }
  );

  return {
    user: data,
    isLoading,
    isError: error
  };
};
