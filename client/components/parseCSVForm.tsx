"use client";
import { uploadCSV } from "@/lib/actions";
import { SupportedLanguage } from "@/lib/types";
import { useState } from "react";
import { useFormState } from "react-dom";

interface parseCSVFormProps {
  userId: string;
  listLanguage: SupportedLanguage;
}

export default function ParseCSVForm({
  userId,
  listLanguage,
}: parseCSVFormProps) {
  const [formstate, action] = useFormState(uploadCSV, { message: "" });
  const [listName, setListName] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCsvFile(event.target.files[0]);
    }
  };

  const handleListNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListName(event.target.value);
  };

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-md bg-slate-100 p-2 text-center"
    >
      <label htmlFor="listName" className="sr-only">
        Enter a list name
      </label>
      <input
        type="text"
        id="listName"
        name="listName"
        placeholder="Enter a list name"
        className="px-4 py-2 text-center text-xl font-semibold"
        value={listName}
        onChange={handleListNameChange}
        required
        maxLength={50}
      />
      <label
        htmlFor="csvfile"
        className="cursor-pointer rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        <input
          type="file"
          name="csvfile"
          id="csvfile"
          accept=".csv"
          className="sr-only"
          aria-label="Upload a CSV File"
          onChange={handleFileChange}
          required
        />
        {csvFile ? csvFile.name : "Choose a CSV file"}{" "}
      </label>
      <input type="hidden" name="language" value={listLanguage} />
      <input type="hidden" name="author" value={userId} />
      {formstate.message !== "" ? (
        <div className="rounded border border-red-400 bg-red-200 p-2">
          {formstate.message}
        </div>
      ) : null}
      <button
        type="submit"
        className="m-2 rounded border-2 border-black p-3 transition-all hover:scale-105 hover:border-green-500 hover:bg-green-500 hover:text-white"
      >
        Start upload & Create a new list
      </button>
    </form>
  );
}
