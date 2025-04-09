import { getList } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";

interface UnitEditPageProps {
  params: {
    listNumberString: string;
    unitNumberString: string;
  };
}

export default async function UnitEditPage({
  params: { listNumberString, unitNumberString },
}: UnitEditPageProps) {
  const listNumber = Number(listNumberString);
  const unitNumber = Number(unitNumberString);
  const [user, list] = await Promise.all([
    getUserOnServer(),
    getList(listNumber),
  ]);

  if (!list?.authors.includes(user.id))
    redirect(paths.unitDetailsPath(listNumber, unitNumber));

  return "Edit me";
}
