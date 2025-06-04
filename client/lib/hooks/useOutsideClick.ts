import { useEffect, useRef } from "react";

export function useOutsideClick(
  callback: () => void,
  condition: boolean = true,
  exceptionSelectors: string[] = []
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const eventTarget = event.target as HTMLElement;

      const clickedException = exceptionSelectors.some((selector) =>
        eventTarget.closest(selector)
      );
      if (clickedException) return;

      if (condition && !elementRef.current?.contains(eventTarget)) {
        callbackRef.current();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exceptionSelectors, condition]);

  return elementRef;
}
