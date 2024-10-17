"use client";

import paths from "@/lib/paths";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  LandingPageContainer,
  LandingPageFormHeader,
  LandingPageInput,
} from "./LandingPageComponents";
import WelcomeMessage from "./WelcomeMessage";
import { FormErrors } from "../Dictionary/FormErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@/lib/validations";
import { Button } from "@headlessui/react";

export default function LoginForm() {
  const [signInError, setSignInError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  const router = useRouter();

  const handleCredentialsLogin = async (data: FieldValues) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setSignInError("Email or Password are incorrect");
      reset();
    } else {
      router.replace(paths.signInPath());
    }
  };

  if (isSubmitting) return <WelcomeMessage mode="login" />;
  return (
    <LandingPageContainer>
      <LandingPageFormHeader title="Sign In" />
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleCredentialsLogin)}
      >
        <LandingPageInput
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Please enter your email"
        />
        <FormErrors errors={errors} field="email" />
        <LandingPageInput
          {...register("password", { required: "Email is required" })}
          type="password"
          placeholder="Please enter your password"
        />
        <FormErrors errors={errors} field="password" />
        {signInError.length > 0 && (
          <p className="text-sm text-red-500">{signInError}</p>
        )}
        <Button className="cursor-pointer rounded-md bg-primary px-6 py-2 font-bold text-white">
          Login with Email
        </Button>
      </form>
      <div className="my-2 flex flex-col gap-y-2">
        <div className="flex w-full justify-between gap-x-2">
          <Button
            className="w-full cursor-pointer rounded-md bg-white px-6 py-2 font-bold text-white"
            onClick={() => {
              signIn("google", { callbackUrl: paths.signInPath() });
            }}
            aria-label="Sign in with Google"
          >
            <FcGoogle className="mx-auto text-2xl" />
          </Button>
          <Button
            className="w-full cursor-pointer rounded-md bg-blue-500 px-6 py-2 font-bold text-white"
            onClick={() => {
              signIn("facebook", { callbackUrl: paths.signInPath() });
            }}
            aria-label="Sign in with Facebook"
          >
            <FaFacebook className="mx-auto text-2xl" />
          </Button>
        </div>
      </div>
    </LandingPageContainer>
  );
}
