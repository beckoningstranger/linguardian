import { FieldErrors, FieldValues } from "react-hook-form";

type FormErrorsProps = {
  errors: FieldErrors<FieldValues>;
  field: string;
};

export function FormErrors({ errors, field }: FormErrorsProps) {
  const error = errors[field];
  if (!error) return null;

  if (Array.isArray(error)) {
    return error.map((error, index) => (
      <div key={index} className="ml-2 text-sm text-red-500">
        {error.message}
      </div>
    ));
  }

  if (typeof error.message === "string")
    return <div className="ml-2 text-sm text-red-500">{error.message}</div>;

  return null;
}
