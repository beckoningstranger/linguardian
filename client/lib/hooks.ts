import { useEffect, useRef } from "react";

export function useOutsideClick(callback: Function, condition: boolean = true) {
  const ref = useRef<HTMLDivElement | HTMLInputElement | HTMLTextAreaElement>(
    null
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        condition &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, condition]);

  return ref;
}

export function useOutsideInputAndKeyboardClick(callback: Function) {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        document.activeElement === ref.current &&
        !(event.target instanceof HTMLButtonElement) &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callback();
      }

      if (
        document.activeElement === ref.current &&
        event.target instanceof HTMLButtonElement &&
        event.target.id.slice(0, 7) !== "IPAKeys" &&
        event.target.id.slice(0, 15) !== "headlessui-tabs" &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}

export function useOutsideClickForUserMenu(callback: Function) {
  const ref = useRef<HTMLDivElement | HTMLInputElement | HTMLTextAreaElement>(
    null
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const eventTarget = event.target as HTMLElement;
      const isLink = eventTarget.closest("#user-menu-link");
      if (isLink || eventTarget.innerHTML === "Logout") return;
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
}
