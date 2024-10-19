"use client";

import NavigateBackButton from "@/components/NavigateBackButton";
import Button from "@/components/ui/Button";
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
        <div className="grid gap-y-2">
          <NavigateBackButton />
          <Button
            intent="secondary"
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
