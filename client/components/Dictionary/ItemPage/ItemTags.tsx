import { Tag } from "@/lib/types";

interface ItemTagsProps {
  tags?: Tag[];
}

export default function ItemTags({ tags }: ItemTagsProps) {
  if (!tags) return null;

  return (
    <div className="flex gap-x-2">
      {tags.map((tag) => (
        <div
          key={tag}
          className="ml-2 rounded-md border border-grey-400 bg-slate-100 px-3 py-1 text-csmr text-gray-800"
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
