import { getUserById } from "@/app/actions";
import ParseCSVForm from "@/components/parseCSVForm";
import getUserOnServer from "@/lib/getUserOnServer";

export default async function CreateList() {
  const sessionUser = await getUserOnServer();
  const user = await getUserById(sessionUser.id);

  if (user)
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="m-4 text-center text-2xl font-bold">
          Here, you can upload CSVs to create new lists
        </h1>
        <ParseCSVForm userId={user.id} />
      </div>
    );

  return "You need to log in before submitting a file";
}
