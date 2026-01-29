import AxiosInstance from '@/lib/axios';
import { ILoginDTO, IRegisterDTO, IUser } from '@/type/login';
import useSWR from 'swr';

interface ILoginResponse {
  data: {
    access_token: string;
  };
}
export const useLogin = (data: ILoginDTO): Promise<ILoginResponse> => {
  return AxiosInstance.post('/user/login', data);
};

export const getProfile = async () => {
  return await AxiosInstance.get('/user/profile');
};

export const useProfile = () => {
  const { data, error, isLoading } = useSWR('/user/profile', getProfile);
  console.log('User data:', data);
  const user: IUser | null = data?.data || null;

  return {
    user,
    isLoading,
    isError: error
  };
};

export const useSignUp = (data: IRegisterDTO): Promise<ILoginResponse> => {
  return AxiosInstance.post('/user/register', data);
};

export const useRefreshToken = async (): Promise<ILoginResponse> => {
  return AxiosInstance.post('/user/refresh-token');
};
