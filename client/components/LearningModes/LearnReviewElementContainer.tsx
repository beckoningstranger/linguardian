import { ReactNode } from "react";

interface LRECProps {
  children: ReactNode;
}
export default function LearnReviewElementContainer({ children }: LRECProps) {
  return <div className="mt-3 flex w-[95%] flex-col gap-3">{children}</div>;
}
