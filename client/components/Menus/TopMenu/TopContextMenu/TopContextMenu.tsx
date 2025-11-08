"use client";

import Image from "next/image";
import { ReactNode, RefObject } from "react";

import { useTopContextMenu } from "@/context/TopContextMenuContext";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";

interface NewTopContextMenuProps {
  children?: ReactNode;
}

export default function TopContextMenu({ children }: NewTopContextMenuProps) {
  const { showTopContextMenu, setShowTopContextMenu } = useTopContextMenu();

  const ref = useOutsideClick(() => setShowTopContextMenu(false));

  return (
    <>
      <div
        id="TopContextMenu"
        ref={ref as RefObject<HTMLDivElement>}
        className="tablet:hidden"
      >
        <div className="absolute left-1/2 top-0 z-10 grid h-[112px] -translate-x-1/2 place-items-center">
          <Image
            alt="Context Menu"
            height={40}
            width={40}
            src={"/icons/Context2.svg"}
            onClick={() => setShowTopContextMenu((prev) => !prev)}
            priority
          />
        </div>
        {showTopContextMenu && (
          <div className="fixed inset-x-0 top-[112px] z-50 grid w-full animate-from-top gap-2 bg-white/60 px-2 py-4 backdrop-blur transition-all">
            {children}
          </div>
        )}
      </div>
    </>
  );
}
