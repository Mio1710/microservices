import { useSignUp } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { IRegisterDTO } from "@/type/login";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const SignUp = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<IRegisterDTO>({
        defaultValues: {
            email: '',
            password: '',
            name: ''
        }
    });
    const onSubmit: SubmitHandler<IRegisterDTO> = async (data: IRegisterDTO) => {
        useSignUp(data)
        const navigate = useNavigate();
        navigate('/login');
    }

    return (

        <form>
            <Card className="w-full max-w-sm m-auto">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Name" className="mb-4" />}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Email" className="mb-4" />}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => <Input {...field} type="password" placeholder="Password" className="mb-4" />}
                    />
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>
                        Login
                    </Button>
                </CardFooter>
            </Card>

        </form>
    )
}