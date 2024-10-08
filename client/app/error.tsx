"use client";

import NavigateBackButton from "@/components/NavigateBackButton";
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
        {/* <button
          className="m-4 rounded-sm bg-slate-200 px-4 py-2"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button> */}
        <NavigateBackButton className="mt-4 w-52 rounded-md bg-slate-200 px-4 py-2">
          Navigate Back
        </NavigateBackButton>
        <div>
          <button
            className="mt-4 w-52 rounded-md bg-slate-200 px-4 py-2"
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
