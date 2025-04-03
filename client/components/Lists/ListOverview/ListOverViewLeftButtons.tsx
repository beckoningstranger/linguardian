import IconSidebar from "@/components/IconSidebar/IconSidebar";
import Button from "@/components/ui/Button";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import Image from "next/image";
import DeleteListButton from "./DeleteListButton";

export default function ListOverviewLeftButtons() {
  return (
    <IconSidebar showOn="tablet">
      <Button intent="icon" color="white" noRing className="shadow-xl">
        <Image
          src={"/icons/Pen.svg"}
          height={72}
          width={72}
          alt="Pen Icon to Edit"
        />
        {/* <TbPencil className="h-12 w-12 text-grey-800" /> */}
      </Button>

      <MobileMenuContextProvider>
        <DeleteListButton />
      </MobileMenuContextProvider>
    </IconSidebar>
  );
}
