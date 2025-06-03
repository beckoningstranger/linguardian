import { FieldErrors, FieldValues } from "react-hook-form";
import { BsExclamationCircle } from "react-icons/bs";

type FormErrorsProps = {
  errors: FieldErrors<FieldValues>;
  field: string;
  nested?: string[];
};

export function FormErrors({ errors, field, nested }: FormErrorsProps) {
  const rawError = errors[field];
  if (!rawError) return null;

  const renderMessage = (message: string, index: number) => (
    <div key={index} className="flex items-center text-cmdr text-red-500">
      <BsExclamationCircle className="mr-2 size-6" />
      {message}
    </div>
  );

  if (Array.isArray(rawError)) {
    const messages = getNestedMessages(rawError, nested);
    return messages.map((msg, i) => renderMessage(msg, i));
  }

  if (typeof rawError.message === "string") {
    return renderMessage(rawError.message, 0);
  }

  return null;
}

function getNestedMessages(errorArray: any[], nestedKeys?: string[]): string[] {
  if (!nestedKeys) {
    return errorArray
      .map((err) => (typeof err.message === "string" ? err.message : ""))
      .filter(Boolean);
  }

  const messages = new Set<string>();

  errorArray.forEach((err) => {
    nestedKeys.forEach((key) => {
      const message = err?.[key]?.message;
      if (typeof message === "string" && message.trim()) {
        messages.add(message);
      }
    });
  });

  return Array.from(messages);
}
