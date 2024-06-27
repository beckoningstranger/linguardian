import { Button } from "@headlessui/react";
import { IoArrowBack } from "react-icons/io5";
import { MdEdit, MdNoteAdd } from "react-icons/md";
import ItemPageContainer from "./ItemPageContainer";
import { SupportedLanguage } from "@/types";
import Link from "next/link";
import paths from "@/paths";
import NavigateBackButton from "../NavigateBackButton";

interface ItemPageTopIconsProps {
  language: SupportedLanguage;
  slug: string;
}
export default function ItemPageTopIcons({
  language,
  slug,
}: ItemPageTopIconsProps) {
  return (
    <ItemPageContainer>
      <NavigateBackButton>
        <IoArrowBack className="h-8 w-8" />
      </NavigateBackButton>
      <div className="flex gap-x-2">
        <Button>
          <Link href={paths.editDictionaryItemPath(language, slug)}>
            <MdEdit className="h-8 w-8" />
          </Link>
        </Button>
        <Button>
          <MdNoteAdd className="h-8 w-8" />
        </Button>
      </div>
    </ItemPageContainer>
  );
}
