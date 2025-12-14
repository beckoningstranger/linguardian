"use server";

import { revalidateTag } from "next/cache";

import { createItem, updateItem } from "@/lib/api/item-api";
import {
  CreateItemParams,
  ItemWithPopulatedTranslations,
  MessageWithItemInfoResponse,
  MessageWithSlugResponse,
} from "@linguardian/shared/contracts";
import { executeAuthenticatedAction, itemTag } from "@/lib/utils";
import { addItemToUnitAction } from "./list-actions";

export async function createItemAction(
  params: CreateItemParams
): Promise<MessageWithItemInfoResponse | MessageWithSlugResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => createItem(params),
    onSuccess: (res) => {
      if (res.type === "itemInfo" && params.listNumber && params.unitName)
        addItemToUnitAction(
          params.listNumber,
          params.unitName,
          res.itemInfo.id,
          res.itemInfo.language
        );
    },
  });
}

export async function updateItemAction(
  item: ItemWithPopulatedTranslations
): Promise<MessageWithItemInfoResponse | MessageWithSlugResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => updateItem(item),
    onSuccess: (res) => {
      if (res.type === "itemInfo") revalidateTag(itemTag(item.id), 'max');
    },
  });
}
