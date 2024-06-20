import paths from "@/paths";
import { SupportedLanguage } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ListStoreCardProps {
  authorData: { username: string; usernameSlug: string }[];
  title: string;
  description: string | undefined;
  image: string | undefined;
  numberOfItems: number;
  numberOfUnits: number | undefined;
  difficulty: string | undefined;
  listNumber: number;
  language: SupportedLanguage;
}

export default function ListStoreCard({
  authorData,
  title,
  description = "No description entered yet...",
  image = "https:/picsum.photos/150?grayscale",
  numberOfItems,
  numberOfUnits = 1,
  difficulty = "Unknown",
  listNumber,
  language,
}: ListStoreCardProps) {
  return (
    <Link href={paths.listDetailsPath(listNumber, language)}>
      <article className="flex w-[340px] flex-col justify-between rounded-md bg-slate-100 shadow-md transition-all hover:shadow-xl xl:w-[350px]">
        <div
          id="title"
          className="mt-2 flex h-[60px] flex-col items-center justify-center"
        >
          {authorData.length > 0 && (
            <h3 className="pt-1 text-[0.7rem] leading-3">
              <span>{authorData.map((author) => author.username)}</span>&apos;s
            </h3>
          )}
          <h2 className="text-[1.4rem]">{title}</h2>
        </div>
        <div id="main" className="flex items-center px-4">
          <Image
            width={150}
            height={150}
            src={image}
            alt={`Image for ${title}`}
            className="rounded-xl"
            priority
          />
          <div
            id="itemNumber&Difficulty"
            className="flex flex-col gap-y-3 px-3 text-sm"
          >
            <div className="flex items-center">
              <Image
                width={50}
                height={50}
                src="https://picsum.photos/50?grayscale"
                alt="Icon for Items"
                className="rounded-md"
              />
              <div className="w-full p-3">
                <div>{numberOfUnits} units</div>
                <div>{numberOfItems} items</div>
              </div>
            </div>
            <div className="flex items-center">
              <Image
                width={50}
                height={50}
                src="https://picsum.photos/50"
                alt="Icon for Difficulty"
                className="rounded-md"
              />
              <div className="p-4">{difficulty}</div>
            </div>
          </div>
        </div>
        <div id="description" className="mt-2 h-[60px] px-4 text-sm">
          {description}
        </div>
      </article>
    </Link>
  );
}
