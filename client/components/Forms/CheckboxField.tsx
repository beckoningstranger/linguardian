"use client";

import { useFormContext } from "react-hook-form";

interface CheckboxFieldProps {
  name: string;
  label: string;
}

export default function CheckboxField({ name, label }: CheckboxFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="flex flex-col items-start gap-1">
      <label className="inline-flex items-center space-x-2">
        <input
          type="checkbox"
          {...register(name)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="select-none text-cmdr text-gray-700">{label}</span>
      </label>
      {errors[name] && (
        <p className="text-sm text-red-500">{(errors[name] as any)?.message}</p>
      )}
    </div>
  );
}
