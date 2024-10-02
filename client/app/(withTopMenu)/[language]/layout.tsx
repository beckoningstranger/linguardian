import { checkPassedLanguageAsync } from "@/lib/helperFunctionsServer";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
  params: { language: string };
}

export default async function LayoutWithTopMenuWithLanguageParam({
  children,
  params,
}: RootLayoutProps) {
  checkPassedLanguageAsync(params.language);
  return children;
}
