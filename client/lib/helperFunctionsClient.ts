export function setErrorsFromBackend<T>(
  errors: Record<keyof T, string[]>,
  setError: (field: keyof T, error: { type: string; message: string }) => void
) {
  Object.entries(errors).forEach(([field, messages]) => {
    (messages as string[]).forEach((message) => {
      setError(field as keyof T, {
        type: "manual",
        message,
      });
    });
  });
}
