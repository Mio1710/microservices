import { useSignUp } from '@/api/auth';
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
import { IRegisterDTO } from '@/type/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import * as z from 'zod';

const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z
    .string()
    .min(1, 'Email can not be empty')
    .email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const SignUp = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IRegisterDTO>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  });
  const onSubmit: SubmitHandler<IRegisterDTO> = async (data: IRegisterDTO) => {
    useSignUp(data);
    toast.success('Sign up successful! Please login to your account.');
    navigate('/login');
  };

  return (
    <div className="h-screen flex items-center">
      <form className="m-auto">
        <Card className="w-full min-w-[400px] max-w-sm m-auto">
          <CardHeader>
            <CardTitle>Create your new account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppInput name="name" control={control} placeholder="Name" />
            <AppInput
              name="email"
              control={control}
              placeholder="Email"
              className="mt-4"
            />
            <AppInput
              name="password"
              control={control}
              type="password"
              placeholder="Password"
              className="mt-4"
            />
            {/* Login */}
            <div className="text-sm text-muted-foreground mt-2">
              You have an account?{' '}
              <Link to="/login" className="text-primary underline">
                Sign in
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Sign up
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
