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

export function arrayShuffle<T>(array: T[]) {
  // Durstenfeld Shuffle: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
