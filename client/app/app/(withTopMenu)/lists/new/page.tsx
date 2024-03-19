"use client";
import { useFormState } from "react-dom";
import { uploadCSV } from "./action";

export default function CreateList() {
  const [formstate, action] = useFormState(uploadCSV, { message: "" });
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="m-4 text-center text-2xl font-bold">
        Here, you can upload CSVs to create new lists
      </h1>
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
        {/* need to pass relevant information about author so the backend can identify user*/}
        <input type="hidden" name="author" value="Joe" />
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
    </div>
  );
}
