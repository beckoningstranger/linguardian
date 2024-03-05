import { Item, PopulatedList } from "@/types";
import axios from "axios";
import Link from "next/link";

interface ShowCourseProps {
  params: {
    listNumberString: string;
  };
}

export default async function UnitDetailPage({
  params: { listNumberString },
}: ShowCourseProps) {
  const listNumber = parseInt(listNumberString);

  async function getUnitData(lNumber: number) {
    "use server";
    try {
      return await axios.get<PopulatedList>(
        `http://localhost:8000/lists/get/${lNumber}`
      );
    } catch (err) {
      console.error(`Error fetching course number ${lNumber}: ${err}`);
    }
  }

  const listData = await getUnitData(listNumber);
  if (listData) {
    const { name, description, authors, units } = listData.data;

    const agg: { [key: string]: Item[] } = {};

    units.map((item) => {
      if (!Object.keys(agg).includes(item.unitName)) {
        agg[item.unitName] = [];
      }
      agg[item.unitName].push(item.item);
    });

    console.log(Object.entries(agg));
    const renderedItems = Object.keys(agg).map((unit) => {
      return (
        <Link href={unit} key="unit">
          {unit}
        </Link>
      );
    });

    return (
      <>
        <div className="mx-10 mt-24">
          <h1>{name}</h1>
          <h5>by {authors}</h5>
          <h3>{description}</h3>
          <div>{renderedItems}</div>
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
