import { getBasicListData } from "@/app/actions";
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
    const { name, description, authors, unitOrder } = listData.data;
    const renderedUnits = unitOrder?.map((unit, index) => {
      return (
        <Link key={unit} href={`/lists/${listNumber}/${index + 1}`}>
          {unit}
        </Link>
      );
    });

    if (renderedUnits)
      return (
        <>
          <div className="mx-10 mt-24">
            <h1>{name}</h1>
            <h5>by {authors}</h5>
            <h3>{description}</h3>
            <div>{renderedUnits}</div>
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
