import { ContextItem } from "@/lib/types";
import ItemSection from "./ItemSection";

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
              className="relative w-fit text-clgr leading-tight desktop:text-cxlm"
            >
              {contextItem.text}
              <div className="absolute -bottom-4 -right-4 text-csmr text-grey-800">
                - {contextItem.takenFrom || contextItem.author}
              </div>
            </div>
          ))}
        </div>
      </ItemSection>
    );
}
