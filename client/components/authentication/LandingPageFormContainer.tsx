import { PropsWithChildren } from "react";

export default function LandingPageFormContainer({
  children,
}: PropsWithChildren) {
  return (
    <div className="w-full rounded-t-lg bg-white/90 px-8 py-2 tablet:max-w-[500px] tablet:rounded-l-lg">
      {children}
    </div>
  );
}
