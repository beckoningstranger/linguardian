import Image from "next/image";

import CreatedByLine from "@/components/Lists/ListOverview/CreatedByLine";

interface ListHeaderProps {
  name: string;
  description?: string;
  image?: string;
  authorData: {
    username: string;
    usernameSlug: string;
  }[];
}

export default function ListHeader({
  name,
  description,
  image,
  authorData,
}: ListHeaderProps) {
  const formattedDescription = description
    ?.split("\n")
    .map((paragraph, index) => <p key={index}>{paragraph}</p>);

  return (
    <div
      id="ListHeader"
      className="relative flex gap-2 overflow-hidden bg-white/90 py-1 tablet:col-span-2 tablet:w-auto tablet:rounded-lg tablet:p-4"
    >
      <Image
        src={image || "/images/ListDefaultImage.webp"}
        alt="List image"
        height={200}
        width={200}
        priority
        className="h-[150px] w-[150px] rounded-md tablet:rounded-2xl tablet:shadow-xl"
      />
      <div className="flex w-full flex-col gap-1 phone:gap-2">
        <div className="my-1 leading-[1] tablet:leading-[1.2]">
          <CreatedByLine authorData={authorData} />
          <h2 className="font-serif text-hsm tablet:text-hmd">{name}</h2>
        </div>
        <h4 className="text-csmr tablet:text-cmdr">{formattedDescription}</h4>
      </div>
    </div>
  );
}
