interface UnitItemTextProps {
  translations: string;
  itemName: string;
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
        text.length > 30
          ? text.length > 40
            ? "text-sm"
            : "text-md"
          : "text-lg"
      } font-semibold text-pretty`}
    >
      {text}
    </div>
  );
}
