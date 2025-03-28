"use client";

import { useState } from "react";
import Logo from "../Logo";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function LandingPageContent() {
  const [mode, setMode] = useState<"present" | "signin" | "register">(
    "present"
  );

  return (
    <>
      <header>
        <nav className="mx-4 flex items-baseline justify-between py-8 sm:mx-12">
          <div>
            <Logo
              onClick={() => {
                setMode("present");
              }}
            />
          </div>
          <div className="items-bottom font-breeSerif mx-1 flex gap-x-2 text-lg font-light tracking-wider text-blue-800 sm:gap-x-4 sm:text-xl md:mx-4">
            <h3 onClick={() => setMode("signin")}>Sign In</h3>
            <h3 onClick={() => setMode("register")}>Register</h3>
          </div>
        </nav>
      </header>
      <main>
        {mode === "present" && (
          <div className="absolute left-1/2 top-3/4 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-y-7 px-8 text-center font-script text-4xl font-black italic tracking-tight text-white sm:px-12 sm:text-5xl lg:px-24 xl:text-6xl">
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
