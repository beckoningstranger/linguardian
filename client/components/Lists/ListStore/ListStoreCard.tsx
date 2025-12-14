import Image from "next/image";
import Link from "next/link";

import paths from "@/lib/paths";
import { List } from "@linguardian/shared/contracts";

interface ListStoreCardProps {
  authorData: { username: string; usernameSlug: string }[];
  list: List;
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
      <div className="text-center">No description entered yet...</div>
    ),
    name: title,
    unitOrder,
  } = list;

  const numberOfItems = units.length;
  const numberOfUnits = unitOrder?.length;

  return (
    <Link href={paths.listDetailsPath(listNumber)}>
      <div className="flex h-[430px] w-[350px] flex-col overflow-hidden rounded-lg shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <Image
          src={image}
          alt="Background picture showing the inside of a greenhouse"
          width={320}
          height={160}
          priority
          className="h-[160px] w-auto object-cover"
        />
        <div className="flex h-full flex-col gap-2 bg-white px-6 py-4">
          <div>
            <h4 className="text-center text-csmr">
              {authorData.map((data) => data.username).join(" & ") + "'s"}
            </h4>
            <h2
              className={`h-[54px] grid place-items-center text-center font-serif text-balance leading-tight ${
                title.length > 24 ? "text-hsm" : "text-hmd"
              }`}
            >
              {title}
            </h2>
          </div>
          <div className="text-center text-cmdr">
            <h4>
              {numberOfItems} items in {numberOfUnits} units
            </h4>
            <h4>{difficulty}</h4>
          </div>
          <h3 className="text-cmdr">{description}</h3>
        </div>
      </div>
    </Link>
  );
}
