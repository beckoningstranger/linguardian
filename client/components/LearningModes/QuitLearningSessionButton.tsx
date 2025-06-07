"use client";

import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import { Button } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import ConfirmCancelMobileMenu from "../ConfirmCancelMobileMenu";
import ConfirmCancelModal from "../ConfirmCancelModal";
import { useMobileMenu } from "@/context/MobileMenuContext";
import { cn } from "@/lib/helperFunctionsClient";

interface QuitLearningSessionButtonProps {
  listLanguage: SupportedLanguage;
  from: "dashboard" | number;
}

export default function QuitLearningSessionButton({
  listLanguage,
  from,
}: QuitLearningSessionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { toggleMobileMenu } = useMobileMenu();
  const router = useRouter();

  const doOnConfirm = () =>
    router.push(
      from === "dashboard"
        ? paths.dashboardLanguagePath(listLanguage)
        : paths.listDetailsPath(from)
    );

  const message = (
    <p className="text-pretty">
      Are you sure you want to quit this learning session and navigate back to
      {from === "dashboard" ? " your dashboard" : " this list's overview"}?
    </p>
  );

  const buttonStyling =
    "absolute h-full top-1/2 w-[60px] h-[112px] py-8 -translate-y-1/2 tablet:hover:bg-red-500 tablet:hover:text-white tablet:size-[112px]";

  return (
    <Button>
      <FaArrowLeft
        className={cn(buttonStyling, "tablet:hidden")}
        onClick={toggleMobileMenu as MouseEventHandler}
      />
      <FaArrowLeft
        className={cn(buttonStyling, "hidden tablet:block")}
        onClick={() => setShowModal(true)}
      />
      <ConfirmCancelModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        doOnConfirm={doOnConfirm}
        title="You are about to lose your progress!"
      >
        {message}
      </ConfirmCancelModal>
      <ConfirmCancelMobileMenu doOnConfirm={doOnConfirm}>
        {message}
      </ConfirmCancelMobileMenu>
    </Button>
  );
}
