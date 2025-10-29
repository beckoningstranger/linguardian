import { Button } from "@headlessui/react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import { SupportedLanguage } from "@/lib/contracts";
import paths from "@/lib/paths";
import { cn } from "@/lib/utils";

type AddListsToDashboardButtonProps = {
  dashboardEmpty: boolean;
  dashboardLanguage: SupportedLanguage;
};

export default function AddListsToDashboardButton({
  dashboardLanguage,
  dashboardEmpty,
}: AddListsToDashboardButtonProps) {
  return (
    <Link
      href={paths.listStorePath(dashboardLanguage)}
      className={cn(dashboardEmpty && "animate-pulse")}
    >
      <Button
        aria-label="Add a new list to your dashboard"
        className="grid size-[90px] place-items-center rounded-full bg-green-500 text-white shadow-xl ring-2 ring-transparent transition-all duration-300 hover:scale-105 hover:ring-green-700 hover:ring-offset-1 hover:ring-offset-white focus:ring-current focus:ring-offset-2 focus:ring-offset-white active:scale-100"
      >
        <FaPlus className="h-8 w-8 font-semibold text-white" />
      </Button>
    </Link>
  );
}
