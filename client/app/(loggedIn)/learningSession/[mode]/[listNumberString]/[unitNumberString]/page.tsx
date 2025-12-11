import type { Metadata } from "next";

import {
  generateUnitMetadata,
  renderUnitPage,
} from "@/app/(loggedIn)/learningSession/[mode]/[listNumberString]/learningSessionPages";
import type { LearningMode } from "@/lib/contracts";
import type { SearchParams } from "@/lib/types";
import {
  parseLearningMode,
  parseListNumber,
  parseUnitNumber,
} from "@/lib/utils/pages";

export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

interface Props {
  params: Promise<{
    mode: LearningMode;
    listNumberString: string;
    unitNumberString: string;
  }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const list = Number(params.listNumberString);
  const unit = Number(params.unitNumberString);
  if (!Number.isFinite(list) || !Number.isFinite(unit))
    return { title: "Learning session" };
  return generateUnitMetadata({
    mode: params.mode,
    listNumber: parseListNumber(params.listNumberString),
    unitNumber: parseUnitNumber(params.unitNumberString),
    searchParams,
  });
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return renderUnitPage({
    mode: parseLearningMode(params.mode),
    listNumber: parseListNumber(params.listNumberString),
    unitNumber: parseUnitNumber(params.unitNumberString),
    searchParams,
  });
}
