"use client";

import NavigateBackButton from "@/components/NavigateBackButton";
import { Button } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="grid h-screen place-items-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Something went wrong!</h2>
        <p>{error.message}</p>

        <NavigateBackButton className="mt-4 w-52 rounded-md bg-slate-200 px-4 py-2">
          Navigate Back
        </NavigateBackButton>
        <div>
          <Button
            className="mt-4 w-52 rounded-md bg-slate-200 px-4 py-2"
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
