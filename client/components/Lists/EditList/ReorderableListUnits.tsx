"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import toast from "react-hot-toast";

import EditUnitButton from "@/components/Lists/EditUnit/EditUnitButton";
import NewUnitButton from "@/components/Lists/EditList/NewUnitButton";
import { useListContext } from "@/context/ListContext";
import { updateUnitOrderAction } from "@/lib/actions/list-actions";

export default function ReorderableListUnits() {
  const { listNumber, unitOrder, setUnitOrder, listLanguage, unitInformation } =
    useListContext();

  const handleReorderUnits = async ({ source, destination }: DropResult) => {
    if (!destination) return;

    const newUnitOrder = Array.from(unitOrder);
    const [movedUnit] = newUnitOrder.splice(source.index, 1);
    newUnitOrder.splice(destination.index, 0, movedUnit);
    if (JSON.stringify(newUnitOrder) === JSON.stringify(unitOrder)) return;

    const previousUnitOrder = [...unitOrder];
    setUnitOrder(newUnitOrder);

    await toast.promise(
      updateUnitOrderAction(listNumber, newUnitOrder, listLanguage.code),
      {
        loading: "Updating unit order...",
        success: (response) => response.message,
        error: (err) => {
          setUnitOrder(previousUnitOrder);
          return err instanceof Error ? err.message : err.toString();
        },
      }
    );
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
                const unitInfo = unitInformation.find(
                  (unit) => unit.unitName === unitName
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
                        className="flex w-full cursor-grab justify-center"
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <EditUnitButton
                          unitName={unitName}
                          noOfItemsInUnit={unitInfo?.noOfItems ?? 0}
                        />
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
          listLanguage={listLanguage.code}
          unitOrder={unitOrder}
          setUnitOrder={setUnitOrder}
        />
      </div>
    </DragDropContext>
  );
}
