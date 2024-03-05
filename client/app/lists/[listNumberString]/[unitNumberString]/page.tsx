import { Item, PopulatedList } from "@/types";
import axios from "axios";
import Link from "next/link";

interface UnitDetailsProps {
  params: {
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitDetailPage({
  params: { listNumberString, unitNumberString },
}: UnitDetailsProps) {
  const listNumber = parseInt(listNumberString);
  const unitNumber = parseInt(unitNumberString);

  async function getUnitData(lNumber: number, uNumber: number) {
    "use server";
    try {
      const list = await axios.get<PopulatedList>(
        `http://localhost:8000/lists/get/${lNumber}`
      );
      if (list && list.data && list.data && list.data.unitOrder) {
        const unitName = list.data.unitOrder[uNumber - 1];
        const unitItems: Item[] = [];
        list.data.units.map((item) => {
          if (unitName === item.unitName) unitItems.push(item.item);
        });
        return unitItems;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching course number ${lNumber}: ${err}`);
    }
  }

  const unitData = await getUnitData(listNumber, unitNumber);
  if (unitData) {
    const renderedItems = unitData.map((item) => (
      <div key={item.name + item.language}>{item.name}</div>
    ));

    return <div>{renderedItems}</div>;
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
