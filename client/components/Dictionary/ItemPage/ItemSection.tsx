import { ReactNode } from "react";

interface ItemSectionProps {
  title: string;
  children?: ReactNode;
}

export default function ItemSection({ title, children }: ItemSectionProps) {
  if (children)
    return (
      <div className="flex flex-col gap-y-2 px-2">
        <h3 className="font-serif text-hmd font-bold text-grey-900">{title}</h3>
        <div className="p-2 text-clgr">{children}</div>
      </div>
    );
}
