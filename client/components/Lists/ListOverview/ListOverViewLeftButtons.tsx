import IconSidebar from "@/components/IconSidebar/IconSidebar";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { TbPencil, TbTrash } from "react-icons/tb";

export default function ListOverviewLeftButtons() {
  return (
    <IconSidebar showOn="tablet">
      <Button intent="icon" color="white" noRing className="shadow-xl">
        <Image
          src={"/icons/Pen.svg"}
          height={90}
          width={90}
          alt="Pen Icon to Edit"
        />
        {/* <TbPencil className="h-12 w-12 text-grey-800" /> */}
      </Button>
      <Button intent="icon" color="white" noRing className="shadow-xl">
        {/* <TbTrash className="h-12 w-12 text-grey-800" />{" "} */}
        <Image
          src={"/icons/Trash.svg"}
          height={90}
          width={90}
          alt="Trash Icon to Delete"
        />
      </Button>
    </IconSidebar>
  );
}
