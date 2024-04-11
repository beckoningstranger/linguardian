import { getUnitItems } from "@/app/actions";
import paths from "@/paths";
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

  const unitData = await getUnitItems(listNumber, unitNumber);
  if (unitData && unitData?.length > 0) {
    const renderedItems = unitData.map((item) => (
      <div key={item.name + item.language}>{item.name}</div>
    ));

    return <div>{renderedItems}</div>;
  }

  return (
    <div>
      <h1>Unit not found</h1>
      <p>This unit does not exist yet. </p>
      <div>
        <Link href={paths.listDetailsPath(listNumber)}>Back to List</Link>
        <Link href={paths.listsPath()}>List Store</Link>
      </div>
    </div>
  );
}
