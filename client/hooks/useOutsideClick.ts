import { useEffect, useRef } from "react";

export function useOutsideClick(callback: Function, condition: Boolean = true) {
  const ref = useRef<HTMLDivElement | HTMLInputElement>(null);

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
  const ref = useRef<HTMLInputElement>(null);

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
