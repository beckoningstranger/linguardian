"use client";

import { MobileMenuContextProvider } from "@/components/Menus/MobileMenu/MobileMenuContext";
import { changeListDetails } from "@/lib/actions";
import paths from "@/lib/paths";
import { Item, LearnedItem, SupportedLanguage } from "@/lib/types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Types } from "mongoose";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import NewUnitButton from "./NewUnitButton";
import UnitButton from "./UnitButton";

interface ListUnitsProps {
  unitOrder: string[];
  units: { unitName: string; item: Item }[];
  listNumber: number;
  language: SupportedLanguage;
  userIsAuthor: boolean;
  learnedItemsForListLanguage: LearnedItem[] | undefined;
}

export default function ListUnits({
  unitOrder: initialUnitOrder,
  units,
  listNumber,
  language,
  userIsAuthor,
  learnedItemsForListLanguage,
}: ListUnitsProps) {
  const [unitOrder, setUnitOrder] = useState(initialUnitOrder);
  const hasOrderChanged = useRef(false);
  const learnedIds = learnedItemsForListLanguage?.map((item) => item.id);
  const unitNames = units.reduce((a, curr) => {
    if (!a.includes(curr.unitName)) a.push(curr.unitName);
    return a;
  }, [] as string[]);

  useEffect(() => {
    if (hasOrderChanged.current) {
      toast.promise(changeListDetails({ listNumber, unitOrder }), {
        loading: "Saving new unit order...",
        success: "Units re-ordered!",
        error: "Error saving new unit order!",
      });
    }
  }, [unitOrder, listNumber]);

  const handleReorderUnits = ({ source, destination }: DropResult) => {
    if (!destination) return;

    const newUnitOrder = Array.from(unitOrder);
    const [movedUnit] = newUnitOrder.splice(source.index, 1);
    newUnitOrder.splice(destination.index, 0, movedUnit);

    setUnitOrder(newUnitOrder);
    hasOrderChanged.current = true;
  };

  return (
    <DragDropContext onDragEnd={handleReorderUnits}>
      <div>
        <Droppable droppableId="units">
          {(provided) => (
            <div
              className="my-2 flex w-full flex-col gap-y-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {unitOrder?.map((unitName, index) => {
                const { noOfItemsInUnit, noOfLearnedItemsInUnit } =
                  getUnitInformation(units, unitName, learnedIds);

                return (
                  <Draggable
                    draggableId={unitName}
                    index={index}
                    key={unitName}
                  >
                    {(provided) => (
                      <Link
                        ref={provided.innerRef}
                        key={index}
                        href={paths.unitDetailsPath(
                          listNumber,
                          index + 1,
                          language
                        )}
                        className="flex w-full justify-center"
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <MobileMenuContextProvider>
                          <UnitButton
                            percentage={
                              noOfItemsInUnit === 0
                                ? 0
                                : (100 / noOfItemsInUnit) *
                                  noOfLearnedItemsInUnit
                            }
                            userIsAuthor={userIsAuthor}
                            unitName={unitName}
                            listNumber={listNumber}
                            noOfItemsInUnit={noOfItemsInUnit}
                            unitOrder={unitNames}
                          />
                        </MobileMenuContextProvider>
                      </Link>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {userIsAuthor && (
          <NewUnitButton listNumber={listNumber} unitNames={unitNames} />
        )}
      </div>
    </DragDropContext>
  );
}

function getUnitInformation(
  units: { unitName: string; item: Item }[],
  unitName: string,
  learnedIds: Types.ObjectId[] | undefined
) {
  const noOfItemsInUnit = units.reduce((a, itemInUnit) => {
    if (itemInUnit.unitName === unitName) a += 1;
    return a;
  }, 0);

  const itemsInUnit = units.filter((item) => item.unitName === unitName);

  const noOfLearnedItemsInUnit = itemsInUnit.filter((item) =>
    learnedIds?.includes(item.item._id)
  ).length;

  const response: {
    noOfItemsInUnit: number;
    noOfLearnedItemsInUnit: number;
  } = {
    noOfItemsInUnit,
    noOfLearnedItemsInUnit,
  };

  return response;
}
