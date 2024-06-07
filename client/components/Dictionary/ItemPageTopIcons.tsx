import { Button } from "@headlessui/react";
import { IoArrowBack } from "react-icons/io5";
import { MdEdit, MdNoteAdd } from "react-icons/md";
import ItemPageContainer from "./ItemPageContainer";
import { SupportedLanguage } from "@/types";
import Link from "next/link";
import paths from "@/paths";
import NavigateBackButton from "../NavigateBackButton";

export default function ItemPageTopIcons({
  language,
}: {
  language: SupportedLanguage;
}) {
  return (
    <ItemPageContainer>
      <NavigateBackButton>
        <IoArrowBack className="h-8 w-8" />
      </NavigateBackButton>
      <div className="flex gap-x-2">
        <Button>
          <MdEdit className="h-8 w-8" />
        </Button>
        <Button>
          <MdNoteAdd className="h-8 w-8" />
        </Button>
      </div>
    </ItemPageContainer>
  );
}
