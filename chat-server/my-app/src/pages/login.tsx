import { AppInput } from '@/components/customs/AppInput';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useAuthContext } from '@/context/auth-context';
import { ILoginDTO } from '@/type/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import * as z from 'zod';

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email can not be empty')
    .email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const Login = () => {
  const { login } = useAuthContext();

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginDTO>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const onSubmit: SubmitHandler<ILoginDTO> = async (data: ILoginDTO) => {
    login(data);
  };

  return (
    <div className="h-screen flex items-center">
      <form className="m-auto">
        <Card className="w-full min-w-[400px] max-w-sm m-auto">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppInput name="email" control={control} placeholder="Email" />
            <AppInput
              name="password"
              control={control}
              placeholder="Password"
              className="mt-4"
            />
            {/* Sign up */}
            <div className="text-sm text-muted-foreground mt-2">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-primary underline">
                Sign up
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
