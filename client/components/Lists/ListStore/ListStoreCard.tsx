import Image from "next/image";
import Link from "next/link";

import paths from "@/lib/paths";
import { PopulatedList } from "@/lib/types";

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
      <div className="text-center">No description entered yet...</div>
    ),
    name: title,
    unitOrder,
  } = list;

  const numberOfItems = units.length;
  const numberOfUnits = unitOrder?.length;

  return (
    <Link href={paths.listDetailsPath(listNumber)}>
      <article className="flex h-[414px] w-[320px] flex-col overflow-hidden rounded-lg shadow-2xl transition-all hover:scale-105 hover:shadow-xl phone:w-[350px] tablet:w-[320px]">
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
              className={`h-[56px] text-center font-serif ${
                title.length > 24 ? "text-hsm" : "text-hmd"
              }`}
            >
              {title}
            </h2>
          </div>
          <div className="text-center text-cmdr">
            <h4>{numberOfItems} items</h4>
            <h4>{numberOfUnits} units</h4>
            <h4>{difficulty}</h4>
          </div>
          <h3 className="text-cmdr">{description}</h3>
        </div>
      </article>
    </Link>
  );
}
