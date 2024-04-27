import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { SigninValidation } from "@/lib/validation";

function SigninForm() {
  const { toast } = useToast();
  const { mutateAsync: signInAccount, isPending: isSigningIn } =
    useSignInAccount();
  const { checkAuthUser } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    console.log(session);

    if (!session) {
      return toast({
        title: "Sign in failed, Please try again",
      });
    }
    const isLoggendIn = await checkAuthUser();
    if (isLoggendIn) {
      console.log("isLoggedIn");
      form.reset();
      navigate("/");
    } else {
      return toast({ title: "Sign in failed, Please try again." });
    }
  }
  return (
    <Form {...form}>
      <div className="flex-center flex-col sm:w-420">
        <img src="/assets/images/logo.svg" alt="logo" />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Login to your account
        </h2>
        <p className="small-meduim md:base-regular mt-2 text-light-3">
          Welcom back, Please enter your details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-4 flex w-full flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-small-regular mt-2 text-center text-light-2">
            You don't have account?{" "}
            <Link
              to={"/sign-up"}
              className="text-small-semibold text-primary-500"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
}

export default SigninForm;
