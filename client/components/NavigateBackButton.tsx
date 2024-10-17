"use client";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";

export default function NavigateBackButton({
  className,
  children,
}: React.PropsWithChildren<{
  className?: string;
}>) {
  const router = useRouter();
  return (
    <Button
      className={className}
      onClick={() => router.back()}
      aria-label="Navigate back"
    >
      {children}
    </Button>
  );
}
