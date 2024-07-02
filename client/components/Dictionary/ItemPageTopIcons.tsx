import paths from "@/lib/paths";
import { SupportedLanguage } from "@/lib/types";
import { Button } from "@headlessui/react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { MdEdit, MdNoteAdd } from "react-icons/md";
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
    <div className="flex justify-between">
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
    </div>
  );
}
