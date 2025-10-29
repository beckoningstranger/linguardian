import type { Metadata } from "next";

import {
  revalidate,
  dynamic,
  fetchCache,
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

export { revalidate, dynamic, fetchCache };

interface Props {
  params: {
    mode: LearningMode;
    listNumberString: string;
    unitNumberString: string;
  };
  searchParams: SearchParams;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
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

export default async function Page({ params, searchParams }: Props) {
  return renderUnitPage({
    mode: parseLearningMode(params.mode),
    listNumber: parseListNumber(params.listNumberString),
    unitNumber: parseUnitNumber(params.unitNumberString),
    searchParams,
  });
}
