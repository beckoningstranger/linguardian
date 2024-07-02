import paths from "@/lib/paths";
import Link from "next/link";

export default function CreatedByLine({
  authorData,
}: {
  authorData: { username: string; usernameSlug: string }[];
}) {
  return (
    <span className="absolute bottom-1 right-1 text-xs">
      {authorData.map((author, index) => (
        <span key={author.usernameSlug}>
          <span>created by </span>
          <Link href={paths.profilePath(author.usernameSlug)}>
            {author.username}
          </Link>
          <span>{authorData.length > index + 1 ? ", " : ""}</span>
        </span>
      ))}
    </span>
  );
}
