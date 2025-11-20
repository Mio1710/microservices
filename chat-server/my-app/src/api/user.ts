import AxiosInstance from '@/lib/axios';
import { IQuery } from '.';

export const getAllUsers = async (query: IQuery) => {
  return await AxiosInstance.get('/user/users', {
    params: query
  });
};
