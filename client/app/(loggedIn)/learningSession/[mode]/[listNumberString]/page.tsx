import type { Metadata } from "next";

import {
  dynamic,
  fetchCache,
  generateListMetadata,
  renderListPage,
  revalidate,
} from "@/app/(loggedIn)/learningSession/[mode]/[listNumberString]/learningSessionPages";
import type { LearningMode } from "@/lib/contracts";
import type { SearchParams } from "@/lib/types";
import { parseLearningMode, parseListNumber } from "@/lib/utils/pages";

export { dynamic, fetchCache, revalidate };

interface Props {
  params: { mode: LearningMode; listNumberString: string };
  searchParams: SearchParams;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const listNumber = Number(params.listNumberString);
  if (!Number.isFinite(listNumber)) return { title: "Learning session" };
  return generateListMetadata({
    mode: params.mode,
    listNumber: parseListNumber(params.listNumberString),
    searchParams,
  });
}

export default async function Page({ params, searchParams }: Props) {
  return renderListPage({
    mode: parseLearningMode(params.mode),
    listNumber: parseListNumber(params.listNumberString),
    searchParams,
  });
}
