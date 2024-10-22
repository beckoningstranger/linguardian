"use client";

import paths from "@/lib/paths";
import { signInSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FormErrors } from "../Dictionary/FormErrors";
import Spinner from "../Spinner";
import Button from "../ui/Button";
import {
  LandingPageFormContainer,
  LandingPageFormHeader,
  LandingPageInput,
} from "./LandingPageComponents";

export default function LoginForm() {
  const [signInError, setSignInError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState<"" | "google" | "facebook">(
    ""
  );

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

  return (
    <LandingPageFormContainer>
      <LandingPageFormHeader title="Sign In" />
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(handleCredentialsLogin)}
      >
        <LandingPageInput
          {...register("email", { required: "Email is required" })}
          id="email"
          type="email"
          placeholder="Enter your email"
        />
        <FormErrors errors={errors} field="email" />
        <LandingPageInput
          {...register("password", { required: "Email is required" })}
          type="password"
          id="password"
          placeholder="Enter your password"
        />
        <FormErrors errors={errors} field="password" />
        {signInError.length > 0 && (
          <p className="text-sm text-red-500">{signInError}</p>
        )}
        <Button
          disabled={isSubmitting || !!isSigningIn}
          intent="primary"
          type="submit"
          noRing
          className="hover:ring-offset-1"
        >
          {isSubmitting ? <Spinner centered size="mini" /> : "Login with Email"}
        </Button>
      </form>
      <div className="my-2 flex flex-col gap-y-2">
        <div className="flex w-full justify-between gap-x-2">
          <Button
            color="white"
            fullWidth
            noRing
            className="hover:ring-offset-1"
            onClick={() => {
              setIsSigningIn("google");
              signIn("google", { callbackUrl: paths.signInPath() });
            }}
            aria-label="Sign in with Google"
            disabled={isSubmitting || !!isSigningIn}
          >
            {isSigningIn === "google" ? (
              <Spinner centered size="mini" />
            ) : (
              <FcGoogle className="mx-auto text-2xl" />
            )}
          </Button>
          <Button
            color="blue"
            fullWidth
            noRing
            className="hover:ring-offset-1"
            onClick={() => {
              setIsSigningIn("facebook");
              signIn("facebook", { callbackUrl: paths.signInPath() });
            }}
            aria-label="Sign in with Facebook"
            disabled
            // disabled={isSubmitting || !!isSigningIn}
          >
            {isSigningIn === "facebook" ? (
              <Spinner centered size="mini" />
            ) : (
              <FaFacebook className="mx-auto text-2xl" />
            )}
          </Button>
        </div>
      </div>
    </LandingPageFormContainer>
  );
}
