"use client";

import paths from "@/lib/paths";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WelcomeMessage from "./WelcomeMessage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  const router = useRouter();

  const inputStyling =
    "w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40";

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
    <div className="grid h-screen place-items-center">
      <div className="rounded-lg border-t-4 border-green-400 p-5 shadow-lg">
        <h1 className="my-4 text-xl font-bold">Sign in to Linguardian</h1>
        <form className="flex flex-col gap-3" onSubmit={handleCredentialsLogin}>
          <input
            type="text"
            placeholder="Please enter your email..."
            className={inputStyling}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="... and your password"
            className={inputStyling}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="cursor-pointer bg-green-600 px-6 py-2 font-bold text-white">
            Login with Email & Password
          </button>
        </form>
        <div className="my-2 flex flex-col gap-y-2">
          <button
            className="cursor-pointer bg-red-400 px-6 py-2 font-bold text-white"
            onClick={() => {
              setLoggingIn(true);
              signIn("google", { callbackUrl: paths.signInPath() });
            }}
          >
            Login with Google
          </button>
          <button
            className="cursor-pointer bg-blue-500 px-6 py-2 font-bold text-white"
            onClick={() => {
              setLoggingIn(true);
              signIn("facebook", { callbackUrl: paths.signInPath() });
            }}
          >
            Login with Facebook
          </button>
        </div>
        {error && (
          <div className="mt-2 w-fit rounded-md bg-red-500 px-3 py-1 text-sm text-white">
            {error}
          </div>
        )}
        <Link href={paths.registerPath()} className="mt-3 text-right text-sm">
          Don&apos;t have an account?{" "}
          <span className="underline">Register</span>
        </Link>
      </div>
    </div>
  );
}
