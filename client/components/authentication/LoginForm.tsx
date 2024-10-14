"use client";

import paths from "@/lib/paths";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  LandingPageContainer,
  LandingPageFormHeader,
  LandingPageInput,
} from "./LandingPageComponents";
import WelcomeMessage from "./WelcomeMessage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const router = useRouter();

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Credentials");
        setLoggingIn(false);
        return;
      }
      router.replace(paths.signInPath());
    } catch (err) {
      console.error(err);
    }
  };

  if (loggingIn) return <WelcomeMessage mode="login" />;
  return (
    <LandingPageContainer>
      <LandingPageFormHeader title="Sign In" />
      <form className="flex flex-col gap-3" onSubmit={handleCredentialsLogin}>
        <LandingPageInput
          type="text"
          placeholder="Please enter your email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <LandingPageInput
          type="password"
          placeholder="...and your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="cursor-pointer rounded-md bg-primary px-6 py-2 font-bold text-white">
          Login with Email & Password
        </button>
      </form>
      <div className="my-2 flex flex-col gap-y-2">
        <div className="flex w-full justify-between gap-x-2">
          <button
            className="w-full cursor-pointer rounded-md bg-white px-6 py-2 font-bold text-white"
            onClick={() => {
              setLoggingIn(true);
              signIn("google", { callbackUrl: paths.signInPath() });
            }}
          >
            <FcGoogle className="mx-auto text-2xl" />
          </button>
          <button
            className="w-full cursor-pointer rounded-md bg-blue-500 px-6 py-2 font-bold text-white"
            onClick={() => {
              setLoggingIn(true);
              signIn("facebook", { callbackUrl: paths.signInPath() });
            }}
          >
            <FaFacebook className="mx-auto text-2xl" />
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-2 w-fit rounded-md bg-red-500 px-3 py-1 text-sm text-white">
          {error}
        </div>
      )}
    </LandingPageContainer>
  );
}
