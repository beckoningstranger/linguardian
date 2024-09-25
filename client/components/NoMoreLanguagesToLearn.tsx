"use client";

import paths from "@/lib/paths";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function NoMoreLanguagesToLearn() {
  const router = useRouter();
  const hasShownToast = useRef(false);
  useEffect(() => {
    if (!hasShownToast.current) {
      toast.error("You can't learn any more languages!");
      router.push(paths.dashboardLanguagePath("FR"));
      hasShownToast.current = true;
    }
  }, [router]);
  return null;
}
