import { PropsWithChildren } from "react";

export default function BackgroundGradient({ children }: PropsWithChildren) {
  return (
    <div
      className="flex min-h-screen flex-col bg-gradient-to-b from-white/0 via-white/0 via-50% to-black/80 to-100%"
      id="BackGroundGradient"
    >
      {children}
    </div>
  );
}
