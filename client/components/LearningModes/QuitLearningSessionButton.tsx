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

  return (
    <Button>
      <FaArrowLeft
        className="absolute left-2 top-1/2 size-[40px] -translate-y-1/2 tablet:left-4 tablet:hidden desktop:size-[50px]"
        onClick={toggleMobileMenu as MouseEventHandler}
      />
      <FaArrowLeft
        className="absolute left-2 top-1/2 hidden size-[40px] -translate-y-1/2 tablet:left-4 tablet:block desktop:size-[50px]"
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
      <ConfirmCancelMobileMenu
        doOnConfirm={doOnConfirm}
        title="You are about to lose your progress!"
        message={`Are you sure you want to quit this learning session and navigate back ${
          from === "dashboard" ? " your dashboard" : " this list's overview"
        } ?`}
      />
    </Button>
  );
}
