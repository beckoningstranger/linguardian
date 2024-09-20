import { removeItemFromList } from "@/lib/actions";
import { ListAndUnitData } from "@/lib/types";
import { Types } from "mongoose";
import toast from "react-hot-toast";
import { FaTrashCan } from "react-icons/fa6";

interface DeleteItemButtonProps {
  listAndUnitData: ListAndUnitData;
  itemId: Types.ObjectId;
}

export default function DeleteItemButton({
  listAndUnitData,
  itemId,
}: DeleteItemButtonProps) {
  return (
    <button
      className="absolute right-3 top-1/2 -translate-y-1/2 transform p-3 text-2xl hover:text-red-500"
      onClick={async (e) => {
        e.preventDefault();
        toast.promise(removeItemFromList(listAndUnitData, itemId), {
          loading: "Deleting the item...",
          success: () => "Item deleted! 🎉",
          error: (err) => err.toString(),
        });
      }}
    >
      <FaTrashCan />
    </button>
  );
}
