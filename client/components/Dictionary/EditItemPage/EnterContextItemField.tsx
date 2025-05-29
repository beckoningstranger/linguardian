"use client";

import { useOutsideInputAndKeyboardClick } from "@/lib/hooks";
import { ContextItem } from "@/lib/types";
import { Input, Textarea } from "@headlessui/react";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import MinusIcon from "./MinusIcon";

interface EnterContextItemsFieldProps {
  contextItems: ContextItem[];
  setContextItems: Dispatch<SetStateAction<ContextItem[]>>;
  index: number;
  activeField: null | number;
  setActiveField: Dispatch<SetStateAction<number | null>>;
}

export default function EnterContextItemsField({
  contextItems,
  setContextItems,
  index,
  activeField,
  setActiveField,
}: EnterContextItemsFieldProps) {
  const textRef = useOutsideInputAndKeyboardClick(handleBlur);
  const takenFromRef = useOutsideInputAndKeyboardClick(handleBlur);
  const initialItem = contextItems[index];

  const [itemText, setItemText] = useState(initialItem.text);
  const [itemTakenFrom, setItemTakenFrom] = useState(initialItem.takenFrom);

  useEffect(() => {
    if (activeField && activeField === index) textRef.current?.focus();
  }, [activeField, index, textRef]);

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
    <div className="relative flex items-center gap-2">
      <Textarea
        ref={textRef as RefObject<HTMLTextAreaElement>}
        className="w-full rounded-md border p-2 shadow-md"
        spellCheck={false}
        id={"contextItem" + index}
        value={itemText}
        onChange={(e) => {
          setItemText(e.target.value);
        }}
        placeholder="Show how this item is used in context..."
        onFocus={() => {
          setActiveField(index);
        }}
        autoFocus={itemText === "" ? true : false}
        onKeyDown={handleKeyDown}
      />
      <Input
        ref={takenFromRef as RefObject<HTMLInputElement>}
        type="text"
        className="size-full rounded-md border shadow-md"
        spellCheck={false}
        id={"contextItem" + index}
        onChange={(e) => setItemTakenFrom(e.target.value)}
        placeholder="Where is this from? Leave empty if you came up with it."
        value={itemTakenFrom}
        onFocus={() => {
          setActiveField(index);
        }}
        onKeyDown={handleKeyDown}
      />
      <MinusIcon onClick={() => removeItem()} />
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

    setActiveField(null);
    textRef.current?.blur();
    takenFromRef.current?.blur();
    return;
  }
}
