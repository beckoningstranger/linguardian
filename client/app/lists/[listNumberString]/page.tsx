import { PopulatedList } from "@/types";
import axios from "axios";
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

  async function getListData(lNumber: number) {
    "use server";
    try {
      return await axios.get<PopulatedList>(
        `http://localhost:8000/lists/get/${lNumber}`
      );
    } catch (err) {
      console.error(`Error fetching course number ${lNumber}: ${err}`);
    }
  }

  const listData = await getListData(listNumber);
  if (listData && listData.data) {
    const { name, description, authors, unitOrder } = listData.data;

    const numberOfUnits = unitOrder?.length;

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
      <h1>Course not found</h1>
      <p>This course does not exist yet. </p>
      <div>
        <Link href="/">Back to Dashboard</Link>{" "}
        <Link href="/courses">Course Store</Link>
      </div>
    </div>
  );
}
