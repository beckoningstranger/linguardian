"use client";
import { uploadCSV } from "@/app/actions";
import { useFormState } from "react-dom";

interface parseCSVFormProps {
  userId: string;
}

export default function ParseCSVForm({ userId }: parseCSVFormProps) {
  const [formstate, action] = useFormState(uploadCSV, { message: "" });

  return (
    <form
      action={action}
      className="flex flex-col gap-3 bg-slate-300 text-center"
    >
      <label htmlFor="csvfile">Upload a CSV file</label>
      <input
        type="file"
        name="csvfile"
        id="csvfile"
        accept=".csv"
        className="p-3"
        required
      />
      <label htmlFor="listName">Enter a list name</label>
      <input
        type="text"
        id="listName"
        name="listName"
        placeholder="List Name"
        className="text-center"
        required
      />
      <label htmlFor="language">What language are you trying to learn?</label>
      <select id="language" name="language" required className="text-center">
        <option value="DE">German</option>
        <option value="EN">English</option>
        <option value="FR">French</option>
        <option value="CN">Mandarin Chinese</option>
      </select>
      <input type="hidden" name="author" value={userId} />
      {formstate.message !== "" ? (
        <div className="rounded border border-red-400 bg-red-200 p-2">
          {formstate.message}
        </div>
      ) : null}
      <button
        type="submit"
        className="m-2 rounded border-2 border-black p-3 hover:bg-slate-500 hover:text-white"
      >
        Create new list
      </button>
    </form>
  );
}
