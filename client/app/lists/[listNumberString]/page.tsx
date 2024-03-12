import { getBasicListData } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";

interface ListDetailProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListDetailPage({
  params: { listNumberString },
}: ListDetailProps) {
  const listNumber = parseInt(listNumberString);

  const listData = await getBasicListData(listNumber);

  if (listData && listData.data) {
    const {
      name,
      description = "No description entered yet...",
      authors,
      unitOrder,
      units,
    } = listData.data;

    const renderedUnits = unitOrder?.map((unitName, index) => {
      // IDEA: see how much the user has learned for each unit and calculate from- and to- values
      // for the gradient colors to visualize their progress
      return (
        <Link
          key={index}
          href={`/lists/${listNumber}/${index + 1}`}
          className="flex w-full justify-center"
        >
          <div
            className={`${
              index % 2 === 0 &&
              "rounded-bl-[70px] rounded-tr-[70px] bg-gradient-to-tr"
            } ${
              index % 2 !== 0 &&
              "rounded-tl-[70px] rounded-br-[70px] bg-gradient-to-tl"
            } border border-slate-800 text-center py-6 shadow-lg hover:shadow-2xl w-10/12 flex justify-center bg-gradient-to-r from-slate-100 to-slate-100`}
          >
            {unitName}
          </div>
        </Link>
      );
    });

    // Calculate how many words the user already knows
    const learned = 20;

    if (renderedUnits)
      return (
        <>
          <div
            id="header"
            className="relative flex border-y-2 border-slate-300"
          >
            <Image
              src="https://picsum.photos/200"
              alt="List image"
              height={200}
              width={200}
              className="w-1/3 md:w-1/6"
              priority
            />
            <div className="flex w-2/3 flex-col items-center">
              <h1 className="my-auto flex justify-center text-2xl">{name}</h1>
              <h5 className="absolute bottom-1 right-3 text-xs">
                created by {authors}
              </h5>
              <h3 className="hidden">{description}</h3>
            </div>
          </div>
          <div id="progress" className="m-3 text-center text-xl">
            {learned} / {units.length} words learned
          </div>
          <div id="units" className="flex flex-col items-center gap-y-2">
            {renderedUnits}
          </div>
        </>
      );
  }

  return (
    <div>
      <h1>List not found</h1>
      <p>This list does not exist yet. </p>
      <div>
        <Link href="/">Back to Dashboard</Link>{" "}
        <Link href="/lists">List Store</Link>
      </div>
    </div>
  );
}
