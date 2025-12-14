"use client";

import { Button } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { Dispatch, RefObject, SetStateAction, useState } from "react";

import StyledInput from "@/components/Forms/StyledInput";
import StyledTextarea from "@/components/Forms/StyledTextArea";
import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { ContextItem } from "@linguardian/shared/contracts";

interface EnterContextItemsFieldProps {
  contextItems: ContextItem[];
  setContextItems: Dispatch<SetStateAction<ContextItem[]>>;
  index: number;
  hasError?: boolean;
  faultyFields: {
    index: number;
    text?: string;
    takenFrom?: string;
  }[];
}

export default function EnterContextItemsField({
  contextItems,
  setContextItems,
  index,
  faultyFields,
}: EnterContextItemsFieldProps) {
  const containerRef = useOutsideClick(handleBlur);

  const initialItem = contextItems[index];

  const [itemText, setItemText] = useState(initialItem.text);
  const [itemTakenFrom, setItemTakenFrom] = useState(initialItem.takenFrom);
  const [showSource, setShowSource] = useState(!!initialItem.takenFrom);

  const removeItem = () =>
    setContextItems((prev) => {
      return prev.filter(
        (contextItem) => contextItem.text.trim() !== initialItem.text
      );
    });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    switch (e.key) {
      case "Tab":
      case "Enter":
      case "Escape":
        handleBlur();
    }
  };
  return (
    <div
      ref={containerRef as RefObject<HTMLDivElement>}
      className="relative flex items-stretch gap-2"
    >
      <StyledTextarea
        label="The item used in context"
        noFloatingLabel
        minusButtonAction={() => removeItem()}
        className="w-full rounded-md p-2 pr-12 shadow-md outline-none"
        spellCheck={false}
        id={"contextItemText" + index}
        value={itemText}
        onChange={(e) => {
          setItemText(e.target.value);
        }}
        placeholder="Show how this item is used in context..."
        autoFocus={itemText === ""}
        onKeyDown={handleKeyDown}
        hasErrors={!!faultyFields.find((error) => error.index === index)?.text}
      />
      {!showSource && (
        <Button
          className="flex w-48 items-center justify-center gap-2 rounded-md bg-green-400 text-white"
          onClick={() => setShowSource(true)}
        >
          <PlusCircleIcon className="size-8" />
          <p className="text-cmdb">Add a source</p>
        </Button>
      )}
      {showSource && (
        <StyledInput
          hasErrors={
            !!faultyFields.find((error) => error.index === index)?.takenFrom
          }
          label="Context Source"
          type="text"
          className="max-w-[400px] rounded-md border shadow-md"
          spellCheck={false}
          id={"contextItemTakenfrom" + index}
          onChange={(e) => setItemTakenFrom(e.target.value)}
          placeholder="Where is this from? Leave empty if you came up with it."
          value={itemTakenFrom}
          autoFocus={itemTakenFrom === ""}
          onKeyDown={handleKeyDown}
          minusButtonAction={() => {
            setItemTakenFrom("");
            setShowSource(false);
          }}
          name={"contextItem" + index}
        />
      )}
    </div>
  );

  function handleBlur() {
    const item: ContextItem = {
      ...initialItem,
      text: itemText.trim(),
      takenFrom: itemTakenFrom?.trim(),
    };
    const itemIsEmpty = item.text === "";
    const itemWasEdited =
      item.text !== initialItem.text ||
      item.takenFrom !== initialItem.takenFrom;

    if (itemIsEmpty) removeItem();

    if (!itemIsEmpty && itemWasEdited) {
      const updatedItems = [...contextItems];
      updatedItems[index] = item;

      // Deduplicate and save
      const seenItems = new Set();
      const uniqueItemsWithoutEmptyOnes = updatedItems.filter(({ text }) => {
        if (!text || seenItems.has(text)) return false;
        seenItems.add(text);
        return true;
      });
      setContextItems(uniqueItemsWithoutEmptyOnes);
    }
  }
}
