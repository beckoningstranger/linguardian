import { getPopulatedList, getUserById } from "@/app/actions";
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

  const listData = await getPopulatedList(listNumber);

  const user = await getUserById(1);

  if (listData && listData.data && user) {
    const {
      name,
      description = "No description entered yet... but this is text that could get quite long. I might even get to three or four lines. Or maybe even longer, who knows? Some people ramble on and on.",
      authors,
      unitOrder,
      units,
      language,
    } = listData.data;

    const renderedUnits = unitOrder?.map((unitName, index) => {
      const noOfItemsInUnit = units.reduce((a, itemInUnit) => {
        if (itemInUnit.unitName === unitName) a += 1;
        return a;
      }, 0);

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
            } border border-slate-800 text-center py-6 shadow-lg hover:shadow-2xl w-11/12 flex justify-center bg-gradient-to-r from-slate-100 to-slate-100`}
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
              src="https://picsum.photos/200?grayscale"
              alt="List image"
              height={200}
              width={200}
              className="w-1/3 md:w-1/6"
              priority
            />
            <div className="flex w-2/3 flex-col items-center justify-center md:w-5/6">
              <div className="flex flex-col">
                <h1 className="mb-2 flex justify-center text-2xl sm:m-2">
                  {name}
                </h1>
                <h3 className="mx-2 text-sm sm:mx-6">{description}</h3>
              </div>
              <h5 className="absolute bottom-1 right-3 text-xs">
                created by {authors}
              </h5>
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
