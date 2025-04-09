import notFound from "@/app/not-found";
import { getPopulatedList } from "@/lib/fetchData";
import { getUserOnServer } from "@/lib/helperFunctionsServer";
import paths from "@/lib/paths";
import { redirect } from "next/navigation";

interface ListEditPageProps {
  params: {
    listNumberString: string;
  };
}

export default async function ListEditPage({
  params: { listNumberString },
}: ListEditPageProps) {
  const listNumber = Number(listNumberString);
  const [user, list] = await Promise.all([
    getUserOnServer(),
    getPopulatedList(listNumber),
  ]);

  if (!list || !user) return notFound();

  // const authorData = await fetchAuthors(list?.authors)
  const userIsAuthor = list?.authors.includes(user.id);

  if (!userIsAuthor) redirect(paths.listDetailsPath(listNumber));

  return <div>Edit me</div>;
}
