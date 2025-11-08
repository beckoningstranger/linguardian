"use client";

import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type KeyboardContextType = {
  showKeyboard: boolean;
  openKeyboard: (content: ReactNode) => void;
  closeKeyboard: () => void;
  setKeyboardContent: (content: ReactNode) => void;
};

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined
);

export function KeyboardContextProvider({ children }: PropsWithChildren) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyBoardContent, setKeyboardContent] = useState<ReactNode>(null);

  const openKeyboard = (content: ReactNode) => {
    setKeyboardContent(content);
    setShowKeyboard(true);
  };
  const closeKeyboard = () => setShowKeyboard(false);

  useEffect(() => {
    if (!showKeyboard) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showKeyboard]);

  const value = useMemo(
    () => ({
      showKeyboard,
      openKeyboard,
      closeKeyboard,
      setKeyboardContent,
    }),
    [showKeyboard]
  );

  return (
    <KeyboardContext.Provider value={value}>
      {showKeyboard && (
        <div className="fixed inset-x-0 bottom-0 z-50 min-h-[260px] animate-from-bottom bg-white/95 pb-4">
          {keyBoardContent}
        </div>
      )}
      {children}
    </KeyboardContext.Provider>
  );
}

export function useKeyboard() {
  const ctx = useContext(KeyboardContext);
  if (!ctx) {
    throw new Error("useKeyboard must be used within KeyboardContextProvider");
  }
  return ctx;
}
