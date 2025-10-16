"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function NavigateBackButton({}: React.PropsWithChildren<{}>) {
  const router = useRouter();
  return (
    <Button
      intent="secondary"
      onClick={() => router.back()}
      aria-label="Navigate back"
      className="px-4"
      rounded
    >
      Navigate Back
    </Button>
  );
}
