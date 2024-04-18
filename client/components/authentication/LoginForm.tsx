"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const inputStyling =
    "w-[400px] border border-gray-200 py-2 px-6 bg-zinc-100/40";

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res && res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashboard");
    } catch (err) {
      console.log(err);
    }
  };

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
              signIn("google", { callbackUrl: "/dashboard" });
            }}
          >
            Login with Google
          </button>
          <button
            className="cursor-pointer bg-blue-500 px-6 py-2 font-bold text-white"
            onClick={() => {
              signIn("facebook", { callbackUrl: "/dashboard" });
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
        <Link href={"/register"} className="mt-3 text-right text-sm">
          Don't have an account? <span className="underline">Register</span>
        </Link>
      </div>
    </div>
  );
}
