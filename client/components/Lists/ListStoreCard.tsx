import paths from "@/lib/paths";
import { PopulatedList } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface ListStoreCardProps {
  authorData: { username: string; usernameSlug: string }[];
  list: PopulatedList;
}

export default function ListStoreCard({
  authorData,
  list,
}: ListStoreCardProps) {
  const {
    listNumber,
    difficulty = "Unknown",
    units,
    image = "/images/ListDefaultImage.webp",
    description = (
      <h4 className="flex justify-center">No description entered yet...</h4>
    ),
    name: title,
    unitOrder,
  } = list;

  const numberOfItems = units.length;
  const numberOfUnits = unitOrder?.length;

  return (
    <Link href={paths.listDetailsPath(listNumber)}>
      <article className="flex h-[400px] w-[320px] flex-col justify-between overflow-hidden rounded-lg shadow-2xl transition-all hover:scale-105 hover:shadow-xl xl:w-[350px]">
        <Image
          src={image}
          alt="Background picture showing the inside of a greenhouse"
          width={320}
          height={160}
          priority
          className="h-[160px] w-full object-cover"
        />
        <div className="flex h-full flex-col gap-2 bg-white px-6 py-4 font-ubuntu">
          <div className="gap-1">
            <h4 className="flex justify-center text-sm">
              {authorData.map((data) => data.username).join(", ")}
            </h4>
            <h2 className="flex justify-center font-playfair text-2xl font-semibold">
              {list.name}
            </h2>
          </div>
          <div className="flex flex-col items-center gap-1 text-sm">
            <h4>{numberOfItems} items</h4>
            <h4>{numberOfUnits} units</h4>
            <h4>{difficulty}</h4>
          </div>
          <h3 className="text-xs">{description}</h3>
        </div>
      </article>
    </Link>
  );
}
