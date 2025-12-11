import { Tag } from "@/lib/contracts";

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
          className="rounded-md border border-grey-400 bg-white px-3 py-1 text-cmdr text-gray-800 drop-shadow-md"
        >
          {tag}
        </div>
      ))}
    </div>
  );
}
