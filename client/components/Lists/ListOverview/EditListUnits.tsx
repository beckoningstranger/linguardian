"use client";

import { useListContext } from "@/context/ListContext";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { changeListDetails } from "@/lib/actions";
import { getUnitInformation } from "@/lib/helperFunctionsClient";
import paths from "@/lib/paths";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import EditUnitButton from "./EditUnitButton";
import NewUnitButton from "./NewUnitButton";

export default function EditListUnits() {
  const {
    listData: { listNumber, units, unitOrder: initialUnitOrder },
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
      <div className="tablet:col-span-2 desktopxl:row-start-2">
        <Droppable droppableId="units">
          {(provided) => (
            <div
              className="my-2 flex w-full flex-col gap-y-2 tablet:m-0"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {unitOrder?.map((unitName, index) => {
                const { noOfItemsInUnit } = getUnitInformation(
                  units,
                  unitName,
                  learnedIds
                );

                return (
                  <Draggable
                    draggableId={unitName}
                    index={index}
                    key={unitName}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        key={index}
                        className="flex w-full justify-center"
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <MobileMenuContextProvider>
                          <EditUnitButton
                            unitName={unitName}
                            noOfItemsInUnit={noOfItemsInUnit}
                            unitOrder={unitOrder}
                            setUnitOrder={setUnitOrder}
                            linkPath={paths.unitDetailsPath(
                              listNumber,
                              index + 1
                            )}
                          />
                        </MobileMenuContextProvider>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <NewUnitButton
          listNumber={listNumber}
          unitOrder={unitOrder}
          setUnitOrder={setUnitOrder}
        />
      </div>
    </DragDropContext>
  );
}
