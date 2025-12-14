import type { Metadata } from "next";

import {
  generateListMetadata,
  renderListPage,
} from "@/app/(loggedIn)/learningSession/[mode]/[listNumberString]/learningSessionPages";
import type { LearningMode } from "@linguardian/shared/contracts";
import type { SearchParams } from "@/lib/types";
import { parseLearningMode, parseListNumber } from "@/lib/utils/pages";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

interface Props {
  params: Promise<{ mode: LearningMode; listNumberString: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const listNumber = Number(params.listNumberString);
  if (!Number.isFinite(listNumber)) return { title: "Learning session" };
  return generateListMetadata({
    mode: params.mode,
    listNumber: parseListNumber(params.listNumberString),
    searchParams,
  });
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return renderListPage({
    mode: parseLearningMode(params.mode),
    listNumber: parseListNumber(params.listNumberString),
    searchParams,
  });
}
