"use server";

import { revalidateTag } from "next/cache";

import {
  addItemToUnit,
  createList,
  createUnit,
  deleteItemFromList,
  deleteList,
  deleteUnit,
  updateListDetails,
  updateUnitName,
  updateUnitOrder,
} from "@/lib/api/list-api";
import {
  AddItemToUnitUpdate,
  CreateListSuccessResponse,
  ListDetailsUpdate,
  MessageResponse,
  SupportedLanguage,
  UnitNameUpdate,
  UnitOrderUpdate,
} from "@/lib/contracts";
import { executeAuthenticatedAction, listStoreTag, listTag } from "@/lib/utils";

export async function createListAction(
  formData: FormData,
  listLanguage: SupportedLanguage
): Promise<CreateListSuccessResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => createList(formData),
    onSuccess: () => {
      revalidateTag(listStoreTag(listLanguage));
    },
  });
}

export async function createUnitAction(
  listNumber: number,
  unitName: string,
  listLanguage: SupportedLanguage
): Promise<MessageResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => createUnit({ unitName }, listNumber),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguage));
    },
  });
}

export async function updateListDetailsAction(
  updates: ListDetailsUpdate,
  listLanguage: SupportedLanguage,
  listNumber: number
): Promise<MessageResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => updateListDetails(updates, listNumber),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguage));
    },
  });
}

export async function updateUnitOrderAction(
  listNumber: number,
  unitOrder: string[],
  listLanguageCode: SupportedLanguage
): Promise<MessageResponse> {
  const update: UnitOrderUpdate = { unitOrder };
  return await executeAuthenticatedAction({
    apiCall: () => updateUnitOrder(update, listNumber),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguageCode));
    },
  });
}

export async function updateUnitNameAction(
  listNumber: number,
  oldName: string,
  newName: string,
  listLanguageCode: SupportedLanguage
): Promise<MessageResponse> {
  const update: UnitNameUpdate = {
    oldName,
    newName,
  };

  return await executeAuthenticatedAction({
    apiCall: () => updateUnitName(update, listNumber),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguageCode));
    },
  });
}

export async function addItemToUnitAction(
  listNumber: number,
  unitName: string,
  itemId: string,
  listLanguage: SupportedLanguage
): Promise<MessageResponse> {
  const update: AddItemToUnitUpdate = { unitName, itemId };

  return await executeAuthenticatedAction({
    apiCall: () => addItemToUnit(listNumber, update),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguage));
    },
  });
}

export async function deleteListAction(
  listNumber: number,
  listLanguage: SupportedLanguage
): Promise<MessageResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => deleteList(listNumber),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguage));
    },
  });
}

export async function deleteUnitAction(
  listNumber: number,
  unitName: string,
  listLanguage: SupportedLanguage
): Promise<MessageResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => deleteUnit(unitName, listNumber),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguage));
    },
  });
}

export async function deleteItemFromListAction(
  listNumber: number,
  itemId: string,
  listLanguage: SupportedLanguage
): Promise<MessageResponse> {
  return await executeAuthenticatedAction({
    apiCall: () => deleteItemFromList(itemId, listNumber),
    onSuccess: () => {
      revalidateTag(listTag(listNumber));
      revalidateTag(listStoreTag(listLanguage));
    },
  });
}
