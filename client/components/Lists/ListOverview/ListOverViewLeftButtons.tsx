import IconSidebar from "@/components/IconSidebar/IconSidebar";
import Button from "@/components/ui/Button";
import Image from "next/image";

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
      </Button>
      <Button intent="icon" color="white" noRing className="shadow-xl">
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
