import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/context/auth-context";
import { ILoginDTO } from "@/type/login";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";

export const Login = () => {
    const { login } = useAuthContext();

    const { control, handleSubmit, formState: { errors } } = useForm<ILoginDTO>({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const onSubmit: SubmitHandler<ILoginDTO> = async (data: ILoginDTO) => {
        login(data)
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
                        name="email"
                        control={control}
                        render={({ field }) => <Input {...field} placeholder="Email" className="mb-4" />}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => <Input {...field} type="password" placeholder="Password" className="mb-4" />}
                    />
                    {/* Sign up */}
                    <div className="text-sm text-muted-foreground">
                        Don't have an account? <Link to="/sign-up" className="text-primary underline">Sign up</Link>
                    </div>
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