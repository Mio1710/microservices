import { getProfile, useLogin } from '@/api/auth';
import { ILoginDTO, IUser } from '@/type/login';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState
} from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

type AuthContext = {
  isAuthenticated: boolean;
  login: (data: ILoginDTO) => Promise<void>;
  logout: () => void;
  user: IUser | null;
};
const initAuthContext: AuthContext = {
  isAuthenticated: false,
  login: async (data: ILoginDTO) => {},
  logout: () => {},
  user: null
};
const AuthContext = createContext<AuthContext>(initAuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const login = async (loginData: ILoginDTO) => {
    // Simulate an API call
    const response = await useLogin(loginData);
    localStorage.setItem('token', response.token);
    setIsAuthenticated(true);
    toast.success('Login successful!');
  };
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const getUser = async () => {
        const response = await getProfile();

        const userData: IUser | null = response?.data;
        setUser(userData);
        console.log('User data:', userData);

        navigate('/');
        setIsAuthenticated(true);
      };
      getUser();
    }
    navigate('/login');
  }, [isAuthenticated]);
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuthContext = () => useContext(AuthContext);
