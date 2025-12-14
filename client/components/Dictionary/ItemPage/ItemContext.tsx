import ItemSection from "@/components/Dictionary/ItemPage/ItemSection";
import { ContextItem } from "@linguardian/shared/contracts";

interface ItemContextProps {
  context?: ContextItem[];
}

export default function ItemContext({ context }: ItemContextProps) {
  if (context && context.length > 0)
    return (
      <ItemSection title="Used in context">
        <div className="mt-2 flex flex-col gap-y-8">
          {context?.map((contextItem) => (
            <div
              key={contextItem.author + contextItem.text}
              className="relative w-fit text-clgr leading-tight"
            >
              {contextItem.text}
              <span className="whitespace-nowrap pl-2 text-csmr text-grey-800">
                - {contextItem.takenFrom || contextItem.author}
              </span>
            </div>
          ))}
        </div>
      </ItemSection>
    );
}
