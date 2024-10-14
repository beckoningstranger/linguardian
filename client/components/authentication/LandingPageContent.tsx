"use client";

import { useState } from "react";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

export default function LandingPageContent() {
  const [mode, setMode] = useState<"present" | "signin" | "register">(
    "present"
  );

  return (
    <>
      <header>
        <nav className="mx-4 flex items-baseline justify-between py-8 font-semibold text-blue-800 sm:mx-12">
          <button
            className="font-dancing text-4xl font-bold sm:text-6xl"
            onClick={() => {
              setMode("present");
            }}
          >
            <h1>Linguardian</h1>
          </button>
          <div className="items-bottom mx-1 flex gap-x-2 font-breeSerif text-lg font-light tracking-wider sm:gap-x-4 sm:text-xl md:mx-4">
            <button onClick={() => setMode("signin")}>
              <h3>Sign In</h3>
            </button>
            <button onClick={() => setMode("register")}>
              <h3>Register</h3>
            </button>
          </div>
        </nav>
      </header>
      <main>
        {mode === "present" && (
          <div className="absolute left-1/2 top-3/4 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-y-7 px-8 text-center font-dancing text-4xl font-black italic tracking-tight text-white sm:px-12 sm:text-5xl lg:px-24 xl:text-6xl">
            <p>Learning a language is like planting seeds</p>
            <p>Start today and see your knowledge blossom</p>
          </div>
        )}
        {mode === "signin" && <LoginForm />}
        {mode === "register" && <RegisterForm />}
      </main>
    </>
  );
}
