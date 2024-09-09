interface UnitItemTextProps {
  translations: string | undefined;
  itemName: string | undefined;
  showTranslations: boolean;
}

export default function UnitItemText({
  translations,
  itemName,
  showTranslations,
}: UnitItemTextProps) {
  const text = showTranslations ? translations : itemName;
  return (
    <div
      className={`${
        text && text.length > 30
          ? text.length > 40
            ? "text-sm"
            : "text-md"
          : "text-lg"
      } font-semibold text-pretty pointer-events-none text-center`}
    >
      {text}
    </div>
  );
}
