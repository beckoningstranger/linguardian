"use client";
import { useRouter } from "next/navigation";
import Button from "./ui/Button";

export default function NavigateBackButton({}: React.PropsWithChildren<{}>) {
  const router = useRouter();
  return (
    <Button
      intent="secondary"
      onClick={() => router.back()}
      aria-label="Navigate back"
    >
      Navigate Back
    </Button>
  );
}
