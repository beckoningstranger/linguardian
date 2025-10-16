"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { DeleteItemButton, UnitItemText } from "@/components";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { updateRecentSearchesAction } from "@/lib/actions/user-actions";
import { ItemPlusLearningInfo } from "@/lib/contracts";
import paths from "@/lib/paths";
import { bgColor, cn, currentItemStatus, nextReviewMessage } from "@/lib/utils";
import { AiOutlineExclamationCircle } from "react-icons/ai";

interface UnitItemProps {
  item: ItemPlusLearningInfo;
  translations: string | undefined;
  pathToUnit: string;
  editMode?: boolean;
}

export default function UnitItem({
  item,
  translations,
  pathToUnit,
  editMode,
}: UnitItemProps) {
  const [showItemTranslation, setShowItemTranslation] =
    useState<boolean>(false);

  return (
    <div
      className={cn(
        `relative pr-4 flex w-full overflow-hidden rounded-lg h-[86px]`,
        bgColor(item.nextReview, item.level)
      )}
    >
      {editMode && (
        <MobileMenuContextProvider>
          <DeleteItemButton itemId={item.id} itemName={item.name} />
        </MobileMenuContextProvider>
      )}
      {translations ? (
        <Image
          alt="Translation Icon"
          height={20}
          width={60}
          className="h-[86px] w-11"
          src={"/icons/Translate.svg"}
          onClick={() => setShowItemTranslation((prev) => !prev)}
        />
      ) : (
        <div
          id="noTranslations"
          className="group bottom-0 left-0 top-0 z-10 flex w-11 items-center justify-start bg-red-500 pl-1 text-cmdr text-white transition-all duration-300 hover:absolute hover:w-full hover:gap-4"
        >
          <AiOutlineExclamationCircle className="size-7 font-bold" />

          <div className="absolute bottom-0 left-0 top-1/2 hidden h-full w-[400px] -translate-x-full -translate-y-1/2 pl-14 text-cmdb group-hover:grid group-hover:translate-x-0 group-hover:items-center">
            This item does not have translations for your native language! Go
            add them!
          </div>
        </div>
      )}
      <Link
        href={paths.dictionaryItemPath(item.slug) + `?comingFrom=${pathToUnit}`}
        className="w-full"
        onClick={() => updateRecentSearchesAction(item.id)}
      >
        <div id="content" className="flex w-full flex-col gap-2 py-4 pl-1">
          <div className="flex w-full items-center justify-between">
            <UnitItemText
              translations={translations}
              itemName={!showItemTranslation ? item.name : translations}
              showItemTranslation={showItemTranslation}
            />
            <div
              className={`text-left absolute top-4 text-csmb text-grey-900 ${
                editMode ? "right-20" : "right-4"
              }`}
            >
              {item.partOfSpeech === "noun" &&
                item.gender &&
                !showItemTranslation && <span>{item.gender} </span>}
              {item.partOfSpeech}
            </div>
          </div>

          {item.level && item.nextReview && (
            <>
              <div className="absolute bottom-2 left-11 flex justify-between text-cxsb text-grey-900 phone:text-csmb">
                Level {item.level}:{" "}
                {currentItemStatus(item.nextReview, item.level)}
              </div>
              <div className="absolute bottom-2 right-4 text-cxsb text-grey-900 phone:text-csmb">
                {nextReviewMessage(item.nextReview, item.level)}
              </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
}
