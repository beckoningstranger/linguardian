"use client";

import { useState } from "react";

import Logo from "../Logo";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { cn } from "@/lib/helperFunctionsClient";

export default function LandingPageContent() {
  const [mode, setMode] = useState<"present" | "signin" | "register">(
    "present"
  );

  return (
    <div
      className="min-h-screen select-none bg-[url('/backgrounds/landingPageBackground.webp')] bg-cover bg-center"
      id="BackgroundImage"
    >
      <div
        className="flex min-h-screen flex-col bg-gradient-to-b from-white/0 via-white/0 via-50% to-black/80 to-100%"
        id="ContainerWithSemiTransparentOverlay"
      >
        <header>
          <nav className="flex items-baseline justify-between bg-white/20 px-4 py-8 tablet:px-12">
            <div>
              <Logo
                onClick={() => {
                  setMode("present");
                }}
              />
            </div>
            <div className="flex gap-x-2 text-clgm font-light tracking-wider text-blue-800 tablet:gap-x-8 tablet:text-cxlm">
              <h3
                onClick={() => setMode("signin")}
                className={cn(
                  "hover:border-blue-800 border-transparent border-b-2",
                  mode === "signin" && "border-blue-800"
                )}
              >
                Sign In
              </h3>
              <h3
                className={cn(
                  "hover:border-blue-800 border-transparent border-b-2",
                  mode === "register" && "border-blue-800"
                )}
                onClick={() => setMode("register")}
              >
                Register
              </h3>
            </div>
          </nav>
        </header>
        <main
          className={cn(
            "flex grow flex-col justify-end",
            mode !== "present" && "items-end"
          )}
        >
          {mode === "present" && (
            <div className="px-4 pb-24 text-center font-script text-h2xl tracking-tight text-white tablet:px-12">
              <p className="text-pretty">
                Learning a language is like planting seeds
              </p>
              <p className="text-pretty">
                Start today and see your knowledge blossom
              </p>
            </div>
          )}
          {mode === "signin" && <LoginForm />}
          {mode === "register" && <RegisterForm />}
        </main>
      </div>
    </div>
  );
}
