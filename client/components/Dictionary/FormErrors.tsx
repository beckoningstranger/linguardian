import { FieldError, Merge } from "react-hook-form";

interface FormErrorsProps {
  errors: Merge<FieldError, (FieldError | undefined)[]> | undefined;
}

export default function FormErrors({ errors }: FormErrorsProps) {
  if (errors)
    return (
      <div>
        {Array.isArray(errors) ? (
          errors.map((error, index) => (
            <div key={index} className="mt-1 text-sm text-red-500">
              {error?.message}
            </div>
          ))
        ) : (
          <div className="mt-1 text-sm text-red-500">{errors.message}</div>
        )}
      </div>
    );
  return null;
}
