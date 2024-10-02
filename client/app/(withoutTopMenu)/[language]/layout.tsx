import { checkPassedLanguageAsync } from "@/lib/helperFunctionsServer";
import { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
  params: { language: string };
}

export default async function LayoutWithoutTopMenuWithLanguageParam({
  children,
  params,
}: RootLayoutProps) {
  await checkPassedLanguageAsync(params.language);
  return children;
}
