import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
}

export default function DashboardContainer({
  children,
}: DashboardContainerProps) {
  return <main className="mt-20">{children}</main>;
}
