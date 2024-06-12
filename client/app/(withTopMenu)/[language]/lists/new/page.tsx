import ParseCSVForm from "@/components/parseCSVForm";
import getUserOnServer from "@/lib/getUserOnServer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload a new list",
};

export default async function CreateList() {
  const sessionUser = await getUserOnServer();

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="m-4 text-center text-2xl font-bold">
        Here, you can upload CSVs to create new lists
      </h1>
      <ParseCSVForm userId={sessionUser.id} />
    </div>
  );
}
