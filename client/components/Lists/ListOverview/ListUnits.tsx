"use client";

import { useListContext } from "@/context/ListContext";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { changeListDetails } from "@/lib/actions";
import paths from "@/lib/paths";
import { Item } from "@/lib/types";
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

export default function ListUnits() {
  const {
    listData: { listNumber, units, unitOrder: initialUnitOrder },
    userIsAuthor,
    learningDataForLanguage,
  } = useListContext();

  const [unitOrder, setUnitOrder] = useState(initialUnitOrder);
  const hasOrderChanged = useRef(false);
  const learnedIds = learningDataForLanguage?.learnedItems?.map(
    (item) => item.id
  );

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

    if (JSON.stringify(newUnitOrder) !== JSON.stringify(unitOrder)) {
      hasOrderChanged.current = true;
      setUnitOrder(newUnitOrder);
    }
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
                const { noOfItemsInUnit, learnedItemsPercentage } =
                  getUnitInformation(units, unitName, learnedIds);

                return userIsAuthor ? (
                  <Draggable
                    draggableId={unitName}
                    index={index}
                    key={unitName}
                  >
                    {(provided) => (
                      <Link
                        ref={provided.innerRef}
                        key={index}
                        href={paths.unitDetailsPath(listNumber, index + 1)}
                        className="flex w-full justify-center"
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <MobileMenuContextProvider>
                          <UnitButton
                            learnedItemsPercentage={learnedItemsPercentage}
                            unitName={unitName}
                            noOfItemsInUnit={noOfItemsInUnit}
                            unitOrder={unitOrder}
                            setUnitOrder={setUnitOrder}
                          />
                        </MobileMenuContextProvider>
                      </Link>
                    )}
                  </Draggable>
                ) : (
                  <Link
                    key={index}
                    href={paths.unitDetailsPath(listNumber, index + 1)}
                    className="flex w-full justify-center"
                  >
                    <MobileMenuContextProvider>
                      <UnitButton
                        learnedItemsPercentage={learnedItemsPercentage}
                        unitName={unitName}
                        noOfItemsInUnit={noOfItemsInUnit}
                        unitOrder={unitOrder}
                        setUnitOrder={setUnitOrder}
                      />
                    </MobileMenuContextProvider>
                  </Link>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        {userIsAuthor && (
          <NewUnitButton
            listNumber={listNumber}
            unitOrder={unitOrder}
            setUnitOrder={setUnitOrder}
          />
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

  const learnedItemsPercentage =
    noOfItemsInUnit === 0
      ? 0
      : (100 / noOfItemsInUnit) * noOfLearnedItemsInUnit;

  return {
    noOfItemsInUnit,
    learnedItemsPercentage,
  };
}
