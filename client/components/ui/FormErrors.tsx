import { FieldErrors, FieldValues } from "react-hook-form";
import { BsExclamationCircle } from "react-icons/bs";

type FormErrorsProps = {
  errors: FieldErrors<FieldValues>;
  field: string;
};

export function FormErrors({ errors, field }: FormErrorsProps) {
  const error = errors[field];
  if (!error) return null;

  const messageStyling = "flex items-center text-cmdr text-red-500";
  const errorIcon = <BsExclamationCircle className="mr-2 size-6" />;

  if (Array.isArray(error)) {
    return error.map((error, index) => (
      <div key={index} className={messageStyling}>
        {errorIcon}
        {error.message}
      </div>
    ));
  }

  if (typeof error.message === "string")
    return (
      <div className={messageStyling}>
        {errorIcon}
        {error.message}
      </div>
    );

  return null;
}
