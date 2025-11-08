"use client";

import Button from "@/components/ui/Button";
import { Input } from "@headlessui/react";
import { useFormContext } from "react-hook-form";

interface SubmitCSVFileProps {
  optional?: boolean;
}

export default function SubmitCSVFile({ optional = true }: SubmitCSVFileProps) {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext();

  const filePicked: boolean = watch().csvfile && watch().csvfile.length > 0;
  return (
    <>
      <Button color="blue" rounded>
        <label htmlFor="csvfile">
          <Input
            {...register("csvfile")}
            type="file"
            id="csvfile"
            accept=".csv"
            className="sr-only"
            aria-label="Upload a CSV File"
          />
          {filePicked
            ? `Your file: ${watch().csvfile[0].name}`
            : `Upload a CSV file ${optional ? "(optional)" : ""}`}
        </label>
      </Button>
      {errors.csvfile && (
        <p className="text-sm text-red-500">{`${errors.csvfile.message}`}</p>
      )}
    </>
  );
}
