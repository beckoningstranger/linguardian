"use client";

import { LanguageWithFlag } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Flag from "react-world-flags";

interface PickNewLanguageProps {
  allUserLanguagesAndFlags: LanguageWithFlag[];
  allLanguagesAndFlags: LanguageWithFlag[];
}

export default function PickNewLanguage({
  allLanguagesAndFlags,
  allUserLanguagesAndFlags,
}: PickNewLanguageProps) {
  const { data: session, update } = useSession();

  const renderedFlags = allLanguagesAndFlags?.map((lwf) => {
    if (
      !allUserLanguagesAndFlags.some(
        (languageWithFlag) => languageWithFlag.name === lwf.name
      )
    )
      return (
        <Link
          key={lwf.name}
          href={`/languages/add?lang=${lwf.name}`}
          onClick={() => {
            session?.user.isLearning.push(lwf);
            update(session);
          }}
        >
          <Flag
            code={lwf.flag}
            className={`my-2 h-24 w-24 rounded-full border-2 border-slate-300 object-cover transition-all hover:scale-125`}
          />
        </Link>
      );
  });

  return <div className="grid grid-cols-2 gap-5">{renderedFlags}</div>;
}
