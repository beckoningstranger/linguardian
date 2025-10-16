import Link from "next/link";

import paths from "@/lib/paths";
import { AuthorData } from "@/lib/contracts";

interface CreatedByLineProps {
  authorData: AuthorData[];
}

export default function CreatedByLine({ authorData }: CreatedByLineProps) {
  return (
    <div className="text-csmr text-grey-900">
      {authorData.map((author, index) => (
        <span key={author.usernameSlug}>
          <Link href={paths.profilePath(author.usernameSlug)}>
            {author.username}
          </Link>
          <span>{authorData.length > index + 1 ? " & " : ""}</span>
        </span>
      ))}
      &apos;s
    </div>
  );
}
