import { useEffect, useRef } from "react";

export function useOutsideClick(callback: Function, condition?: Boolean) {
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
