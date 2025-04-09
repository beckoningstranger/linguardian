import { cn } from "@/lib/helperFunctionsClient";

interface UnitItemTextProps {
  translations: string | undefined;
  itemName: string | undefined;
  showItemTranslation: boolean;
}

export default function UnitItemText({
  translations,
  itemName,
  showItemTranslation,
}: UnitItemTextProps) {
  const text = showItemTranslation ? translations : itemName;
  return (
    <p
      className={cn(
        "font-semibold text-pretty pointer-events-none max-w-[32ch] truncate",
        text && text.length > 30 ? "text-cmdb leading-tight" : "text-clgb"
        // text && text.length > 50 && "text-cxsr"
      )}
    >
      {text}
    </p>
  );
}
