import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
}

export default function DashboardContainer({
  children,
}: DashboardContainerProps) {
  return <div className="mt-20">{children}</div>;
}
