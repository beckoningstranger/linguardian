import { cn } from "@/lib/utils";

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
        "font-semibold text-pretty pointer-events-none max-w-[18ch] phone:max-w-[22ch] tablet:max-w-[42ch] desktop:max-w-[22ch] truncate text-clgm leading-tight",
        text && text.length > 40 && "text-cmdb",
        text && text.length > 60 && "text-csmr"
      )}
    >
      {text}
    </p>
  );
}
