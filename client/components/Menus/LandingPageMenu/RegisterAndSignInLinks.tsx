"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import paths from "@/lib/paths";
import { cn } from "@/lib/utils";

export default function RegisterAndSignInLinks() {
  const currentPath = usePathname();
  const linkStyling =
    "hover:border-blue-800 border-transparent border-b-2 cursor-pointer";

  return (
    <div className="flex gap-x-2 text-cmdr font-light tracking-wider text-blue-800 phone:text-clgm tablet:gap-x-8 tablet:text-cxlm">
      <Link
        href={paths.signInPath()}
        className={cn(
          linkStyling,
          currentPath.includes("signIn") && "border-blue-800"
        )}
      >
        Sign In
      </Link>
      <Link
        href={paths.registerPath()}
        className={cn(
          linkStyling,
          currentPath.includes("register") && "border-blue-800"
        )}
      >
        Register
      </Link>
    </div>
  );
}
