import { IUser } from '@/type/login';
import useSWR from 'swr';
import { IQuery } from '..';
import { getAllUsers } from '../user';

export const useUser = (query: IQuery) => {
  const { data, error, isLoading } = useSWR(['users', query], () =>
    getAllUsers(query)
  );
  const users: IUser[] = data?.data || [];
  return { users, error, isLoading };
};
